import os
import io
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
import matplotlib.patches as mpatches
import numpy as np
from datetime import datetime
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle,
    Image, PageBreak, HRFlowable
)
from reportlab.lib import colors
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import inch
from reportlab.lib.pagesizes import A4
from reportlab.lib.enums import TA_CENTER, TA_LEFT, TA_RIGHT
from reportlab.platypus.flowables import Flowable
from reportlab.lib import utils
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.pdfbase import pdfmetrics
from django.conf import settings


# ── Colour Palette ────────────────────────────────────────────────────────────
DARK_NAVY   = colors.HexColor("#0D1B2A")
MID_NAVY    = colors.HexColor("#1B2A4A")
ACCENT_BLUE = colors.HexColor("#2563EB")
ACCENT_TEAL = colors.HexColor("#0891B2")
SUCCESS     = colors.HexColor("#16A34A")
WARNING     = colors.HexColor("#D97706")
DANGER      = colors.HexColor("#DC2626")
CRITICAL    = colors.HexColor("#7C3AED")
LIGHT_BG    = colors.HexColor("#F1F5F9")
SUBTLE_BG   = colors.HexColor("#E2E8F0")
WHITE       = colors.white
TEXT_DARK   = colors.HexColor("#1E293B")
TEXT_MID    = colors.HexColor("#475569")
TEXT_LIGHT  = colors.HexColor("#94A3B8")


# ── Custom Flowables ──────────────────────────────────────────────────────────
class ColorBar(Flowable):
    def __init__(self, width, height=4, color=ACCENT_BLUE, radius=2):
        Flowable.__init__(self)
        self.width  = width
        self.height = height
        self.color  = color
        self.radius = radius

    def draw(self):
        self.canv.setFillColor(self.color)
        self.canv.roundRect(0, 0, self.width, self.height,
                            self.radius, fill=1, stroke=0)


# ── Chart Helpers ─────────────────────────────────────────────────────────────
def _fig_to_image(fig, width=5 * inch, height=2.8 * inch):
    buf = io.BytesIO()
    fig.savefig(buf, format="png", dpi=150, bbox_inches="tight",
                facecolor=fig.get_facecolor())
    buf.seek(0)
    plt.close(fig)
    return Image(buf, width=width, height=height)


def _gauge_chart(risk_score):
    fig, ax = plt.subplots(figsize=(5, 2.8),
                           subplot_kw={"projection": "polar"},
                           facecolor="#0D1B2A")
    ax.set_facecolor("#0D1B2A")
    zones = [
        (np.linspace(np.pi,       np.pi * 0.7, 100), "#16A34A"),
        (np.linspace(np.pi * 0.7, np.pi * 0.4, 100), "#D97706"),
        (np.linspace(np.pi * 0.4, np.pi * 0.1, 100), "#DC2626"),
        (np.linspace(np.pi * 0.1, 0,            100), "#7C3AED"),
    ]
    for zone_theta, col in zones:
        ax.plot(zone_theta, [0.85] * len(zone_theta),
                linewidth=18, color=col, alpha=0.85, solid_capstyle="butt")
    needle_angle = np.pi - (risk_score / 10) * np.pi
    ax.annotate("", xy=(needle_angle, 0.75), xytext=(0, 0),
                arrowprops=dict(arrowstyle="-|>", color="white", lw=2.5, mutation_scale=18))
    ax.plot(0, 0, "o", color="white", markersize=8, zorder=5)
    ax.text(0, -0.25, f"{risk_score:.1f}", transform=ax.transData,
            ha="center", va="center", fontsize=26, fontweight="bold", color="white")
    ax.text(0, -0.50, "Risk Score", transform=ax.transData,
            ha="center", va="center", fontsize=10, color="#94A3B8")
    ax.set_ylim(0, 1)
    ax.axis("off")
    return _fig_to_image(fig, width=4.5 * inch, height=2.5 * inch)


def _violations_bar(violations):
    if not violations:
        return None
    pollutants  = [v.get("pollutant", "Unknown") for v in violations]
    excesses    = [float(v.get("excess_percentage", 0)) for v in violations]
    severities  = [v.get("severity", "low").lower() for v in violations]
    sev_colors  = {"critical": "#7C3AED", "high": "#DC2626",
                   "medium": "#D97706",   "low":  "#16A34A"}
    bar_colors  = [sev_colors.get(s, "#2563EB") for s in severities]
    fig, ax = plt.subplots(figsize=(6, max(2.5, len(pollutants) * 0.6)), facecolor="#0D1B2A")
    ax.set_facecolor("#1B2A4A")
    y_pos = np.arange(len(pollutants))
    bars  = ax.barh(y_pos, excesses, color=bar_colors, height=0.55, edgecolor="none", alpha=0.9)
    for bar, val in zip(bars, excesses):
        ax.text(bar.get_width() + 0.5, bar.get_y() + bar.get_height() / 2,
                f"{val:.1f}%", va="center", fontsize=9, color="white", fontweight="bold")
    ax.set_yticks(y_pos)
    ax.set_yticklabels(pollutants, color="white", fontsize=9)
    ax.set_xlabel("Excess Above Limit (%)", color="#94A3B8", fontsize=9)
    ax.tick_params(colors="#94A3B8", labelsize=8)
    ax.spines[:].set_visible(False)
    ax.set_title("Violations — Excess Percentage", color="white", fontsize=11, fontweight="bold", pad=10)
    legend_patches = [mpatches.Patch(color=c, label=l.capitalize()) for l, c in sev_colors.items()]
    ax.legend(handles=legend_patches, loc="lower right", fontsize=8,
              framealpha=0.2, labelcolor="white", facecolor="#1B2A4A", edgecolor="none")
    fig.tight_layout()
    return _fig_to_image(fig, width=5.5 * inch, height=max(2.5, len(pollutants) * 0.6) * inch)


def _severity_donut(violations):
    if not violations:
        return None
    from collections import Counter
    counts     = Counter(v.get("severity", "low").lower() for v in violations)
    labels     = list(counts.keys())
    sizes      = list(counts.values())
    sev_map    = {"critical": "#7C3AED", "high": "#DC2626", "medium": "#D97706", "low": "#16A34A"}
    pie_colors = [sev_map.get(l, "#2563EB") for l in labels]
    fig, ax = plt.subplots(figsize=(3.5, 2.8), facecolor="#0D1B2A")
    ax.set_facecolor("#0D1B2A")
    _, _, autotexts = ax.pie(sizes, colors=pie_colors, autopct="%1.0f%%", startangle=90,
                             pctdistance=0.78,
                             wedgeprops={"width": 0.55, "edgecolor": "#0D1B2A", "linewidth": 2})
    for at in autotexts:
        at.set_color("white"); at.set_fontsize(9); at.set_fontweight("bold")
    ax.legend([l.capitalize() for l in labels], loc="lower center", bbox_to_anchor=(0.5, -0.12),
              ncol=2, fontsize=7, framealpha=0, labelcolor="white")
    ax.set_title("By Severity", color="white", fontsize=10, fontweight="bold", pad=6)
    return _fig_to_image(fig, width=3.2 * inch, height=2.6 * inch)


def _trend_sparkline(trend_data):
    if not trend_data or len(trend_data) < 2:
        return None
    dates  = [d["date"]  for d in trend_data]
    scores = [d["score"] for d in trend_data]
    fig, ax = plt.subplots(figsize=(6, 2.2), facecolor="#0D1B2A")
    ax.set_facecolor("#1B2A4A")
    ax.fill_between(range(len(scores)), scores, alpha=0.25, color="#2563EB")
    ax.plot(range(len(scores)), scores, color="#2563EB", linewidth=2.5,
            marker="o", markersize=5, markerfacecolor="white",
            markeredgecolor="#2563EB", markeredgewidth=1.5)
    ax.axhline(8, color="#DC2626", linewidth=1, linestyle="--", alpha=0.7, label="High (8)")
    ax.axhline(5, color="#D97706", linewidth=1, linestyle="--", alpha=0.7, label="Medium (5)")
    ax.set_xticks(range(len(dates)))
    ax.set_xticklabels(dates, rotation=30, ha="right", color="#94A3B8", fontsize=7)
    ax.set_ylabel("Risk Score", color="#94A3B8", fontsize=8)
    ax.set_ylim(0, 10.5)
    ax.tick_params(colors="#94A3B8", labelsize=7)
    ax.spines[:].set_visible(False)
    ax.set_title("Risk Score Trend", color="white", fontsize=11, fontweight="bold", pad=8)
    ax.legend(fontsize=7, framealpha=0.2, labelcolor="white", facecolor="#1B2A4A", edgecolor="none")
    fig.tight_layout()
    return _fig_to_image(fig, width=5.5 * inch, height=2.2 * inch)


# ── Colour Logic ──────────────────────────────────────────────────────────────
def _status_color(status):
    return {"compliant": SUCCESS, "non-compliant": DANGER, "under review": WARNING,
            "pending": ACCENT_BLUE, "critical": CRITICAL}.get(status.lower(), ACCENT_TEAL)

def _threat_color(threat):
    return {"low": SUCCESS, "medium": WARNING, "high": DANGER,
            "critical": CRITICAL}.get(threat.lower(), ACCENT_BLUE)

def _severity_color(sev):
    return {"low": SUCCESS, "medium": WARNING, "high": DANGER,
            "critical": CRITICAL}.get(sev.lower(), ACCENT_BLUE)

def _severity_bg(sev):
    return {"critical": colors.HexColor("#F3E8FF"), "high": colors.HexColor("#FEE2E2"),
            "medium":   colors.HexColor("#FEF3C7"), "low":  colors.HexColor("#DCFCE7")
            }.get(sev.lower(), LIGHT_BG)


# ── Recommendation Engine ─────────────────────────────────────────────────────
def _build_recommendations(result):
    recs   = []
    score  = result.risk_score
    threat = (result.threat_level or "").lower()
    status = (result.status or "").lower()
    viols  = result.violations or []

    if score >= 9:
        recs += [
            ("URGENT", "Regulatory",
             "Immediately notify the relevant environmental authority — a breach at this level may trigger mandatory reporting obligations."),
            ("URGENT", "Operations",
             "Initiate emergency shutdown protocols for the highest-offending emission sources until levels return below threshold."),
            ("URGENT", "Legal",
             "Engage legal counsel to assess potential liability. Document all remediation actions with timestamps."),
        ]
    elif score >= 8:
        recs += [
            ("HIGH", "Regulatory",
             "Prepare and submit a corrective action plan to the regulatory body within 48 hours."),
            ("HIGH", "Operations",
             "Conduct an immediate operational audit of all processes linked to flagged pollutants."),
            ("HIGH", "Monitoring",
             "Increase sensor sampling frequency to every 15 minutes for all critical emission points."),
        ]
    elif score >= 6:
        recs += [
            ("MEDIUM", "Operations",
             "Review and optimise combustion/process controls responsible for the flagged pollutants."),
            ("MEDIUM", "Monitoring",
             "Increase monitoring from daily to every 6 hours for medium-severity pollutants."),
            ("MEDIUM", "Training",
             "Schedule refresher compliance training for operations staff within 2 weeks."),
        ]
    elif score >= 4:
        recs += [
            ("LOW", "Monitoring",   "Continue standard monitoring schedule; review emission limits quarterly."),
            ("LOW", "Preventive",   "Investigate root causes of minor exceedances to prevent future escalation."),
        ]
    else:
        recs += [
            ("INFO", "Compliance",  "Facility is performing well. Maintain current procedures and document best practices."),
            ("INFO", "Audit",       "Schedule the next internal compliance audit within 90 days as part of routine operations."),
        ]

    if threat == "critical":
        recs.append(("URGENT", "Health & Safety",
                     "Conduct an immediate health-risk assessment for surrounding communities and on-site staff."))
    elif threat == "high":
        recs.append(("HIGH", "Health & Safety",
                     "Implement additional PPE requirements in high-emission zones. Review safety data sheets."))

    if status == "non-compliant":
        recs.append(("HIGH", "Documentation",
                     "Retain evidence of all non-compliant readings for at least 5 years in line with audit requirements."))
    elif status == "under review":
        recs.append(("MEDIUM", "Reporting",
                     "Ensure all supporting data and methodology are available for the reviewing authority on request."))

    for v in viols:
        sev    = v.get("severity", "low").lower()
        poll   = v.get("pollutant", "Unknown")
        excess = float(v.get("excess_percentage", 0))
        if sev == "critical":
            recs.append(("URGENT", "Pollutant Control",
                         f"{poll} exceeds safe limits by {excess:.1f}%. Isolate the emission source and deploy emergency scrubbing."))
        elif sev == "high" and excess > 50:
            recs.append(("HIGH", "Pollutant Control",
                         f"{poll} is {excess:.1f}% above threshold — consider upgrading abatement technology for this stream."))
        elif sev == "medium":
            recs.append(("MEDIUM", "Process Optimisation",
                         f"Review process parameters contributing to elevated {poll} levels ({excess:.1f}% over limit)."))

    return recs


# ── Styles ────────────────────────────────────────────────────────────────────
def _styles():
    base = getSampleStyleSheet()
    def s(name, **kw):
        return ParagraphStyle(name, parent=base["Normal"], **kw)
    return {
        "cover_title": s("ct", fontSize=30, textColor=WHITE, fontName="Helvetica-Bold", spaceAfter=6, leading=36),
        "cover_sub":   s("cs", fontSize=13, textColor=colors.HexColor("#93C5FD"), fontName="Helvetica", spaceAfter=4),
        "section_h":   s("sh", fontSize=14, textColor=DARK_NAVY, fontName="Helvetica-Bold", spaceBefore=14, spaceAfter=6),
        "body":        s("bd", fontSize=9.5, textColor=TEXT_DARK, fontName="Helvetica", leading=15, spaceAfter=4),
        "body_light":  s("bl", fontSize=9,   textColor=TEXT_MID,  fontName="Helvetica", leading=14),
        "kpi_lbl":     s("kl", fontSize=8,   textColor=TEXT_MID,  fontName="Helvetica", alignment=TA_CENTER),
        "footer":      s("ft", fontSize=7.5, textColor=TEXT_LIGHT, fontName="Helvetica", alignment=TA_CENTER),
    }


# ── Main ──────────────────────────────────────────────────────────────────────
def generate_compliance_report(result):
    """
    Generates structured PDF report and attaches it to ComplianceResult.
    Drop-in replacement — same signature and return value as the original.
    """
    file_name = f"compliance_report_{result.id}.pdf"
    file_path = os.path.join(settings.MEDIA_ROOT, "reports", file_name)
    os.makedirs(os.path.dirname(file_path), exist_ok=True)

    margin     = 0.65 * inch
    doc        = SimpleDocTemplate(file_path, pagesize=A4,
                                   rightMargin=margin, leftMargin=margin,
                                   topMargin=margin,   bottomMargin=margin)
    page_width = A4[0] - 2 * margin
    elements   = []
    ST         = _styles()

    # ── COVER ──────────────────────────────────────────────────────────────
    cover = Table(
        [[Paragraph("COMPLIANCE REPORT", ST["cover_title"])],
         [Paragraph(f"<font color='#93C5FD'>{result.submission.company.company_name}</font>",
                    ST["cover_sub"])]],
        colWidths=[page_width],
    )
    cover.setStyle(TableStyle([
        ("BACKGROUND", (0,0), (-1,-1), DARK_NAVY),
        ("PADDING",    (0,0), (-1,-1), 24),
        ("BOTTOMPADDING", (0,0), (-1,-1), 30),
    ]))
    elements.append(cover)
    elements.append(Spacer(1, 0.12 * inch))
    elements.append(ColorBar(page_width, height=5, color=ACCENT_BLUE, radius=0))
    elements.append(Spacer(1, 0.22 * inch))

    meta_left = [
        [Paragraph("<b>Report ID</b>",       ST["body_light"]), Paragraph(f"#{result.id}", ST["body"])],
        [Paragraph("<b>Company</b>",         ST["body_light"]), Paragraph(result.submission.company.company_name, ST["body"])],
        [Paragraph("<b>Submission Date</b>", ST["body_light"]), Paragraph(result.created_at.strftime("%d %B %Y"), ST["body"])],
        [Paragraph("<b>Generated On</b>",    ST["body_light"]), Paragraph(datetime.now().strftime("%d %B %Y — %H:%M"), ST["body"])],
    ]
    meta_right = [
        [Paragraph("<b>Status</b>",           ST["body_light"]), Paragraph(result.status, ST["body"])],
        [Paragraph("<b>Risk Score</b>",       ST["body_light"]), Paragraph(f"{result.risk_score} / 10", ST["body"])],
        [Paragraph("<b>Threat Level</b>",     ST["body_light"]), Paragraph(result.threat_level, ST["body"])],
        [Paragraph("<b>Violations Found</b>", ST["body_light"]), Paragraph(str(len(result.violations or [])), ST["body"])],
    ]
    cell_style = TableStyle([
        ("ROWBACKGROUNDS", (0,0), (-1,-1), [WHITE, LIGHT_BG]),
        ("PADDING",        (0,0), (-1,-1), 7),
        ("GRID",           (0,0), (-1,-1), 0.3, SUBTLE_BG),
    ])
    lt = Table(meta_left,  colWidths=[1.3*inch, 2.3*inch]); lt.setStyle(cell_style)
    rt = Table(meta_right, colWidths=[1.3*inch, 2.3*inch]); rt.setStyle(cell_style)
    meta_row = Table([[lt, Spacer(0.3*inch, 1), rt]], colWidths=[3.7*inch, 0.3*inch, 3.7*inch])
    meta_row.setStyle(TableStyle([("VALIGN", (0,0), (-1,-1), "TOP")]))
    elements.append(meta_row)
    elements.append(Spacer(1, 0.18 * inch))
    elements.append(HRFlowable(width="100%", thickness=1, color=SUBTLE_BG))
    elements.append(Spacer(1, 0.1 * inch))
    elements.append(Paragraph(
        "This report has been automatically generated by the Compliance Monitoring System. "
        "All findings are based on the data submitted in the referenced submission record. "
        "This document should be reviewed by a qualified environmental compliance officer "
        "before being used for regulatory or legal purposes.", ST["body_light"]))
    elements.append(PageBreak())

    # ── KPI CARDS ──────────────────────────────────────────────────────────
    score   = result.risk_score
    threat  = result.threat_level
    status  = result.status
    n_viols = len(result.violations or [])

    def kpi(value, label, color, bg):
        t = Table(
            [[Paragraph(str(value), ParagraphStyle("kv2", fontSize=22, textColor=color,
                fontName="Helvetica-Bold", alignment=TA_CENTER, spaceAfter=2))],
             [Paragraph(label, ST["kpi_lbl"])]],
            colWidths=[(page_width / 4) - 16],
        )
        return t

    kpi_cells = [
        kpi(f"{score}/10",  "RISK SCORE",
            SUCCESS if score < 5 else WARNING if score < 8 else DANGER,
            colors.HexColor("#EFF6FF")),
        kpi(threat.upper(), "THREAT LEVEL", _threat_color(threat), colors.HexColor("#FFF7ED")),
        kpi(status.upper(), "STATUS",       _status_color(status), colors.HexColor("#F0FDF4")),
        kpi(n_viols,        "VIOLATIONS",
            SUCCESS if n_viols == 0 else WARNING if n_viols < 3 else DANGER,
            colors.HexColor("#FEF2F2")),
    ]
    kpi_row = Table([kpi_cells], colWidths=[page_width / 4] * 4)
    kpi_row.setStyle(TableStyle([
        ("BACKGROUND", (0,0), (0,0), colors.HexColor("#EFF6FF")),
        ("BACKGROUND", (1,0), (1,0), colors.HexColor("#FFF7ED")),
        ("BACKGROUND", (2,0), (2,0), colors.HexColor("#F0FDF4")),
        ("BACKGROUND", (3,0), (3,0), colors.HexColor("#FEF2F2")),
        ("BOX",        (0,0), (-1,-1), 1, SUBTLE_BG),
        ("LINEBEFORE", (1,0), (-1,-1), 1, SUBTLE_BG),
        ("PADDING",    (0,0), (-1,-1), 14),
        ("ALIGN",      (0,0), (-1,-1), "CENTER"),
        ("VALIGN",     (0,0), (-1,-1), "MIDDLE"),
    ]))
    elements.append(kpi_row)
    elements.append(Spacer(1, 0.3 * inch))

    # ── RISK SECTION ───────────────────────────────────────────────────────
    elements.append(Paragraph("Risk Assessment", ST["section_h"]))
    elements.append(ColorBar(page_width, height=3, color=ACCENT_BLUE, radius=2))
    elements.append(Spacer(1, 0.15 * inch))

    gauge = _gauge_chart(score)
    trend = _trend_sparkline(getattr(result, "trend_data", None))
    if gauge and trend:
        cr = Table([[gauge, Spacer(0.2*inch,1), trend]], colWidths=[4.5*inch, 0.2*inch, 5.0*inch])
        cr.setStyle(TableStyle([("VALIGN", (0,0), (-1,-1), "MIDDLE")]))
        elements.append(cr)
    elif gauge:
        elements.append(gauge)
    elements.append(Spacer(1, 0.1 * inch))

    if score >= 9 or threat.lower() == "critical":
        interp = "⚠️  <b>CRITICAL:</b>  The risk score is at a dangerous level. Immediate corrective action is mandatory. Regulatory notification may be required."
        icolor = CRITICAL
    elif score >= 8 or threat.lower() == "high":
        interp = "🔴  <b>HIGH RISK:</b>  Several parameters are significantly above safe thresholds. A corrective action plan must be submitted within 48 hours."
        icolor = DANGER
    elif score >= 6:
        interp = "🟠  <b>ELEVATED RISK:</b>  Some parameters exceed permissible levels. Enhanced monitoring and process review are strongly recommended."
        icolor = WARNING
    elif score >= 4:
        interp = "🟡  <b>MODERATE:</b>  Minor exceedances detected. Continue monitoring and implement preventive measures to avoid escalation."
        icolor = WARNING
    else:
        interp = "🟢  <b>COMPLIANT:</b>  The facility is operating within acceptable compliance thresholds. Maintain current practices."
        icolor = SUCCESS

    ibox = Table([[Paragraph(interp, ParagraphStyle("ip", fontSize=9.5, textColor=TEXT_DARK,
                                                     fontName="Helvetica", leading=14))]],
                 colWidths=[page_width])
    ibox.setStyle(TableStyle([("BACKGROUND", (0,0), (-1,-1), LIGHT_BG),
                               ("PADDING",    (0,0), (-1,-1), 10),
                               ("LINEBEFORE", (0,0), (0,-1),  4, icolor)]))
    elements.append(ibox)
    elements.append(Spacer(1, 0.3 * inch))

    # ── VIOLATIONS ─────────────────────────────────────────────────────────
    elements.append(Paragraph("Violations Breakdown", ST["section_h"]))
    elements.append(ColorBar(page_width, height=3, color=DANGER, radius=2))
    elements.append(Spacer(1, 0.15 * inch))

    if result.violations:
        data = [["#", "Pollutant", "Measured", "Limit", "Excess %", "Severity", "Unit"]]
        for i, v in enumerate(result.violations, 1):
            data.append([str(i), v.get("pollutant", "—"), str(v.get("measured_value", "—")),
                         str(v.get("limit_value", "—")), f"{v.get('excess_percentage', 0):.1f}%",
                         v.get("severity", "—").capitalize(), v.get("unit", "—")])

        vt = Table(data, colWidths=[0.3*inch, 1.6*inch, 0.85*inch, 0.85*inch, 0.85*inch, 1.0*inch, 0.7*inch], repeatRows=1)
        vstyle = [
            ("BACKGROUND",     (0,0), (-1,0),  MID_NAVY),
            ("TEXTCOLOR",      (0,0), (-1,0),  WHITE),
            ("FONTNAME",       (0,0), (-1,0),  "Helvetica-Bold"),
            ("FONTSIZE",       (0,0), (-1,-1), 8.5),
            ("PADDING",        (0,0), (-1,-1), 6),
            ("GRID",           (0,0), (-1,-1), 0.3, SUBTLE_BG),
            ("ROWBACKGROUNDS", (0,1), (-1,-1), [WHITE, LIGHT_BG]),
            ("ALIGN",          (0,0), (-1,-1), "CENTER"),
            ("ALIGN",          (1,0), (1,-1),  "LEFT"),
            ("VALIGN",         (0,0), (-1,-1), "MIDDLE"),
        ]
        for i, v in enumerate(result.violations, 1):
            sev = v.get("severity", "low").lower()
            vstyle += [("BACKGROUND", (5,i), (5,i), _severity_bg(sev)),
                       ("TEXTCOLOR",  (5,i), (5,i), _severity_color(sev)),
                       ("FONTNAME",   (5,i), (5,i), "Helvetica-Bold")]
        vt.setStyle(TableStyle(vstyle))
        elements.append(vt)
        elements.append(Spacer(1, 0.3 * inch))

        bar_img   = _violations_bar(result.violations)
        donut_img = _severity_donut(result.violations)
        if bar_img and donut_img:
            cr = Table([[bar_img, Spacer(0.2*inch,1), donut_img]],
                       colWidths=[5.5*inch, 0.2*inch, 3.2*inch])
            cr.setStyle(TableStyle([("VALIGN", (0,0), (-1,-1), "MIDDLE")]))
            elements.append(cr)
        elif bar_img:
            elements.append(bar_img)
        elements.append(Spacer(1, 0.3 * inch))
    else:
        elements.append(Paragraph("✓  No violations were detected in this submission.",
            ParagraphStyle("ok", fontSize=11, textColor=SUCCESS, fontName="Helvetica-Bold", spaceAfter=8)))
        elements.append(Spacer(1, 0.2 * inch))

    # ── RECOMMENDATIONS ────────────────────────────────────────────────────
    elements.append(Paragraph("Recommendations & Action Plan", ST["section_h"]))
    elements.append(ColorBar(page_width, height=3, color=SUCCESS, radius=2))
    elements.append(Spacer(1, 0.15 * inch))

    priority_cfg = {
        "URGENT": (CRITICAL,    colors.HexColor("#F3E8FF"), "⚡ URGENT"),
        "HIGH":   (DANGER,      colors.HexColor("#FEE2E2"), "🔴 HIGH"),
        "MEDIUM": (WARNING,     colors.HexColor("#FEF3C7"), "🟠 MEDIUM"),
        "LOW":    (SUCCESS,     colors.HexColor("#DCFCE7"), "🟢 LOW"),
        "INFO":   (ACCENT_BLUE, colors.HexColor("#EFF6FF"), "ℹ️  INFO"),
    }
    for priority, category, text in _build_recommendations(result):
        accent, bg, badge = priority_cfg.get(priority, (ACCENT_BLUE, LIGHT_BG, priority))
        rec = Table(
            [[Paragraph(badge, ParagraphStyle("badge", fontSize=7.5, fontName="Helvetica-Bold",
                                              textColor=accent, alignment=TA_CENTER)),
              Paragraph(f"<b>[{category}]</b>  {text}",
                        ParagraphStyle("rtext", fontSize=9, fontName="Helvetica",
                                       textColor=TEXT_DARK, leading=14))]],
            colWidths=[0.9*inch, page_width - 0.9*inch],
        )
        rec.setStyle(TableStyle([
            ("BACKGROUND", (0,0), (-1,-1), bg),
            ("BACKGROUND", (0,0), (0,-1),  WHITE),
            ("PADDING",    (0,0), (-1,-1), 8),
            ("LINEBEFORE", (0,0), (0,-1),  4, accent),
            ("VALIGN",     (0,0), (-1,-1), "MIDDLE"),
            ("GRID",       (0,0), (-1,-1), 0.3, SUBTLE_BG),
        ]))
        elements.append(rec)
        elements.append(Spacer(1, 0.07 * inch))

    elements.append(Spacer(1, 0.25 * inch))

    # ── FOOTER ─────────────────────────────────────────────────────────────
    elements.append(HRFlowable(width="100%", thickness=1, color=SUBTLE_BG))
    elements.append(Spacer(1, 0.1 * inch))
    ft = Table(
        [[Paragraph(f"Compliance Report · {result.submission.company.company_name} · "
                    f"Generated {datetime.now().strftime('%Y-%m-%d %H:%M')}", ST["footer"]),
          Paragraph("CONFIDENTIAL — For internal use only",
                    ParagraphStyle("conf", fontSize=7.5, textColor=DANGER,
                                   fontName="Helvetica-Bold", alignment=TA_RIGHT))]],
        colWidths=[page_width * 0.65, page_width * 0.35],
    )
    ft.setStyle(TableStyle([("VALIGN", (0,0), (-1,-1), "MIDDLE"), ("PADDING", (0,0), (-1,-1), 0)]))
    elements.append(ft)

    # ── BUILD + ATTACH ─────────────────────────────────────────────────────
    doc.build(elements)

    result.report_file.name = f"reports/{file_name}"
    result.save()
    return result.report_file.url