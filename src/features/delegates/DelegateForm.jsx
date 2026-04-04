import { useState } from "react";
import { Input } from "../../components/ui/Input";
import { Button } from "../../components/ui/Button";
import { delegateStatusOptions } from "../../utils/statusFormat";
import "./DelegateForm.css";

export function DelegateForm({ colleges, onSubmit, onCancel }) {
  const [name, setName] = useState("");
  const [regNumber, setRegNumber] = useState("");
  const [collegeId, setCollegeId] = useState(colleges[0]?.id ?? "");
  const [phone, setPhone] = useState("");
  const [status, setStatus] = useState("soft_yes");

  function handleSubmit(e) {
    e.preventDefault();
    if (!name.trim() || !collegeId) return;
    onSubmit({
      name: name.trim(),
      reg_number: regNumber.trim() || null,
      college_id: Number(collegeId),
      contact: phone.trim() || null,
      notes: null,
      status,
    });
    setName("");
    setRegNumber("");
    setPhone("");
  }

  return (
    <form className="delegate-form" onSubmit={handleSubmit}>
      <Input label="Full name" value={name} onChange={(e) => setName(e.target.value)} required />
      <Input
        label="Registration number"
        placeholder="e.g. REG/2024/001"
        value={regNumber}
        onChange={(e) => setRegNumber(e.target.value)}
      />
      <label className="delegate-form-label">
        <span>College</span>
        <select className="delegate-form-select" value={collegeId} onChange={(e) => setCollegeId(e.target.value)}>
          {colleges.map((c) => (
            <option key={c.id} value={c.id}>
              {c.code}
            </option>
          ))}
        </select>
      </label>
      <Input label="Phone" value={phone} onChange={(e) => setPhone(e.target.value)} />
      <label className="delegate-form-label">
        <span>Initial status</span>
        <select className="delegate-form-select" value={status} onChange={(e) => setStatus(e.target.value)}>
          {delegateStatusOptions().map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      </label>
      <div className="delegate-form-actions">
        <Button type="submit">Add delegate</Button>
        <Button type="button" variant="ghost" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </form>
  );
}