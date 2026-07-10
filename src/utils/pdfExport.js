import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import { formatMoney } from './format'
import { getCategory } from '../constants/categories'

export function exportDashboardPDF({ user, totalThisMonth, remaining, health, catData, currency }) {
  const doc = new jsPDF()
  doc.setFontSize(18)
  doc.text('Ledgerly — Dashboard Summary', 14, 18)
  doc.setFontSize(10)
  doc.setTextColor(120)
  doc.text(`Generated for ${user?.name || ''} on ${new Date().toLocaleDateString()}`, 14, 25)

  doc.setTextColor(0)
  doc.setFontSize(12)
  doc.text(`Income: ${formatMoney(user?.monthlyIncome, currency)}`, 14, 38)
  doc.text(`Spent this month: ${formatMoney(totalThisMonth, currency)}`, 14, 45)
  doc.text(`Remaining: ${formatMoney(remaining, currency)}`, 14, 52)
  doc.text(`Health score: ${health.score}/100 (${health.label})`, 14, 59)

  autoTable(doc, {
    startY: 68,
    head: [['Category', 'Amount']],
    body: Object.entries(catData).map(([id, v]) => [getCategory(id).label, formatMoney(v, currency)]),
    theme: 'grid',
    headStyles: { fillColor: [15, 92, 86] },
  })

  doc.save('ledgerly-dashboard.pdf')
}

export function exportExpensesCSV(expenses, currency) {
  const header = ['Date', 'Description', 'Category', 'Payment Method', 'Amount', 'Notes']
  const rows = expenses.map(e => [e.date, e.description, getCategory(e.category).label, e.paymentMethod || '', e.amount, (e.notes || '').replace(/,/g, ';')])
  const csv = [header, ...rows].map(r => r.map(v => `"${v}"`).join(',')).join('\n')
  const blob = new Blob([csv], { type: 'text/csv' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'ledgerly-expenses.csv'
  a.click()
  URL.revokeObjectURL(url)
}

export function exportReportPDF(report, currency) {
  const doc = new jsPDF()
  doc.setFontSize(18)
  doc.text(`Ledgerly — ${report.month} Report`, 14, 18)
  doc.setFontSize(10)
  doc.setTextColor(120)
  doc.text(`Generated ${new Date(report.generatedAt).toLocaleString()}`, 14, 25)

  doc.setTextColor(0)
  doc.setFontSize(11)
  const summaryLines = doc.splitTextToSize(report.summary, 180)
  doc.text(summaryLines, 14, 36)

  const afterSummaryY = 36 + summaryLines.length * 6 + 8

  autoTable(doc, {
    startY: afterSummaryY,
    head: [['Category', 'Amount']],
    body: report.topCategories.map(([id, v]) => [getCategory(id).label, formatMoney(v, currency)]),
    theme: 'grid',
    headStyles: { fillColor: [15, 92, 86] },
  })

  doc.save(`ledgerly-report-${report.month.replace(' ', '-')}.pdf`)
}
