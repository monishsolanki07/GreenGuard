import csv
from policies.models import PollutantPolicy


def evaluate_submission(csv_path):
    violations = []
    safe_items = []
    unknown = []
    seen_pollutants = set()
    risk_score = 0

    with open(csv_path, newline="") as csvfile:
        reader = csv.DictReader(csvfile)

        required_columns = {"pollutant", "value"}
        if not reader.fieldnames or set(reader.fieldnames) != required_columns:
            raise ValueError("CSV must contain exactly two columns: pollutant,value")

        for row in reader:
            pollutant_name = row["pollutant"].strip()

            if not pollutant_name:
                raise ValueError("Pollutant name cannot be empty")

            if pollutant_name in seen_pollutants:
                raise ValueError(f"Duplicate pollutant entry detected: {pollutant_name}")

            seen_pollutants.add(pollutant_name)

            try:
                value = float(row["value"])
            except ValueError:
                raise ValueError(f"Invalid numeric value for {pollutant_name}")

            if value < 0:
                raise ValueError(f"Negative emission value for {pollutant_name}")

            policy = PollutantPolicy.objects.filter(
                name__iexact=pollutant_name
            ).first()

            if not policy:
                unknown.append(pollutant_name)
                continue

            if value > policy.safe_limit:
                excess_percentage = (
                    (value - policy.safe_limit) / policy.safe_limit
                ) * 100

                # Severity grading
                if excess_percentage <= 10:
                    severity = "MINOR"
                    risk_score += 1
                elif excess_percentage <= 30:
                    severity = "MODERATE"
                    risk_score += 3
                else:
                    severity = "CRITICAL"
                    risk_score += 5

                violations.append({
                    "pollutant": pollutant_name,
                    "value": value,
                    "limit": policy.safe_limit,
                    "unit": policy.unit,
                    "excess_percentage": round(excess_percentage, 2),
                    "severity": severity
                })
            else:
                safe_items.append({
                    "pollutant": pollutant_name,
                    "value": value,
                    "limit": policy.safe_limit,
                    "unit": policy.unit
                })

    # Threat level classification
    if risk_score == 0:
        threat_level = "LOW"
    elif risk_score <= 3:
        threat_level = "MEDIUM"
    else:
        threat_level = "HIGH"

    # Compliance decision
    if violations:
        overall_status = "NON_COMPLIANT"
    elif unknown:
        overall_status = "REVIEW_REQUIRED"
    else:
        overall_status = "COMPLIANT"

    return {
        "status": overall_status,
        "violations": violations,
        "safe": safe_items,
        "unknown": unknown,
        "risk_score": risk_score,
        "threat_level": threat_level
    }