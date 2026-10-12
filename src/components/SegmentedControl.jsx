/** Radio-based segmented control. `options`: [{ value, label }]. */
export default function SegmentedControl({ name, label, value, options, onChange }) {
  return (
    <div className="segmented" role="radiogroup" aria-label={label}>
      {options.map((option) => (
        <label key={option.value} className={`segmented__option ${value === option.value ? 'is-active' : ''}`.trim()}>
          <input type="radio" name={name} value={option.value} checked={value === option.value} onChange={() => onChange(option.value)} />
          {option.label}
        </label>
      ))}
    </div>
  );
}
