import { Bar, BarChart, CartesianGrid, Cell, Legend, Line, LineChart, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { useCurrency } from '../hooks/useCurrency';
import { CHART_COLORS, EXPENSE_COLOR, INCOME_COLOR } from '../utils/constants';

const AXIS_STYLE = { fontSize: 12, fill: '#66726c' };
const GRID_COLOR = '#e6ebe7';

const tooltipStyle = {
  borderRadius: 12,
  border: '1px solid #dfe6e1',
  boxShadow: '0 8px 24px rgba(20,40,30,.12)',
  fontSize: 13,
};

const fullLabel = (_, payload) => payload?.[0]?.payload.fullLabel;

/** Doughnut chart of spending by category, with a legend listing amounts. `data`: [{ name, value }]. */
export function SpendingDoughnut({ data }) {
  const { format } = useCurrency();
  const total = data.reduce((sum, item) => sum + item.value, 0);

  return (
    <div className="doughnut">
      <div
        className="doughnut__chart"
        role="img"
        aria-label={`Spending by category: ${data.map((item) => `${item.name} ${format(item.value)}`).join(', ')}.`}
      >
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie data={data} dataKey="value" nameKey="name" innerRadius="62%" outerRadius="92%" paddingAngle={2} stroke="none" animationDuration={700}>
              {data.map((item, index) => (
                <Cell key={item.name} fill={CHART_COLORS[index % CHART_COLORS.length]} />
              ))}
            </Pie>
            <Tooltip formatter={(value) => format(value)} contentStyle={tooltipStyle} />
          </PieChart>
        </ResponsiveContainer>
        <div className="doughnut__center" aria-hidden="true">
          <span>Spent</span>
          <strong>{format(total, { compact: total >= 100000 })}</strong>
        </div>
      </div>
      <ul className="legend">
        {data.map((item, index) => (
          <li key={item.name} className="legend__item">
            <span className="legend__swatch" style={{ background: CHART_COLORS[index % CHART_COLORS.length] }} />
            <span className="legend__name">{item.name}</span>
            <span className="legend__value">{format(item.value)}</span>
            <span className="legend__share">{Math.round((item.value / total) * 100)}%</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

/** Line chart of monthly expenses. `data`: [{ label, fullLabel, expenses }]. */
export function ExpenseTrendChart({ data }) {
  const { format } = useCurrency();
  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={data} margin={{ top: 8, right: 12, bottom: 0, left: 0 }}>
        <CartesianGrid stroke={GRID_COLOR} vertical={false} />
        <XAxis dataKey="label" tick={AXIS_STYLE} axisLine={false} tickLine={false} />
        <YAxis tick={AXIS_STYLE} axisLine={false} tickLine={false} width={56} tickFormatter={(value) => format(value, { compact: true })} />
        <Tooltip formatter={(value) => [format(value), 'Expenses']} labelFormatter={fullLabel} contentStyle={tooltipStyle} />
        <Line type="monotone" dataKey="expenses" stroke={EXPENSE_COLOR} strokeWidth={3} dot={{ r: 4, strokeWidth: 2, fill: '#fff' }} activeDot={{ r: 6 }} animationDuration={800} />
      </LineChart>
    </ResponsiveContainer>
  );
}

/** Grouped bars comparing income and expenses per month. */
export function IncomeExpenseChart({ data }) {
  const { format } = useCurrency();
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data} margin={{ top: 8, right: 12, bottom: 0, left: 0 }} barGap={4}>
        <CartesianGrid stroke={GRID_COLOR} vertical={false} />
        <XAxis dataKey="label" tick={AXIS_STYLE} axisLine={false} tickLine={false} />
        <YAxis tick={AXIS_STYLE} axisLine={false} tickLine={false} width={56} tickFormatter={(value) => format(value, { compact: true })} />
        <Tooltip formatter={(value, name) => [format(value), name]} labelFormatter={fullLabel} contentStyle={tooltipStyle} cursor={{ fill: 'rgba(11,93,69,.06)' }} />
        <Legend iconType="circle" wrapperStyle={{ fontSize: 13, paddingTop: 8 }} />
        <Bar dataKey="income" name="Income" fill={INCOME_COLOR} radius={[6, 6, 0, 0]} maxBarSize={28} animationDuration={800} />
        <Bar dataKey="expenses" name="Expenses" fill={EXPENSE_COLOR} radius={[6, 6, 0, 0]} maxBarSize={28} animationDuration={800} />
      </BarChart>
    </ResponsiveContainer>
  );
}
