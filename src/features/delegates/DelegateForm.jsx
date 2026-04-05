import { useState, useEffect } from "react";
import { Input } from "../../components/ui/Input";
import { Button } from "../../components/ui/Button";
import { delegateStatusOptions } from "../../utils/statusFormat";
import { fetchSchools, fetchDepartments } from "../../services/delegates.service.js";
import "./DelegateForm.css";

export function DelegateForm({ colleges, onSubmit, onCancel }) {
  const [name, setName] = useState("");
  const [regNumber, setRegNumber] = useState("");
  const [collegeId, setCollegeId] = useState(colleges[0]?.id ?? "");
  const [schoolId, setSchoolId] = useState("");
  const [departmentId, setDepartmentId] = useState("");
  const [phone, setPhone] = useState("");
  const [status, setStatus] = useState("soft_yes");
  const [schools, setSchools] = useState([]);
  const [departments, setDepartments] = useState([]);

  // Load schools when college changes
  useEffect(() => {
    if (!collegeId) return;
    setSchoolId("");
    setDepartmentId("");
    setDepartments([]);
    fetchSchools(collegeId)
      .then((d) => setSchools(d.schools || []))
      .catch(() => setSchools([]));
  }, [collegeId]);

  // Load departments when school changes
  useEffect(() => {
    if (!schoolId) return;
    setDepartmentId("");
    fetchDepartments(schoolId)
      .then((d) => setDepartments(d.departments || []))
      .catch(() => setDepartments([]));
  }, [schoolId]);

  function handleSubmit(e) {
    e.preventDefault();
    if (!name.trim() || !collegeId) return;
    onSubmit({
      name: name.trim(),
      reg_number: regNumber.trim() || null,
      college_id: Number(collegeId),
      school_id: schoolId ? Number(schoolId) : null,
      department_id: departmentId ? Number(departmentId) : null,
      contact: phone.trim() || null,
      notes: null,
      status,
    });
    setName("");
    setRegNumber("");
    setPhone("");
    setSchoolId("");
    setDepartmentId("");
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

      {/* College */}
      <label className="delegate-form-label">
        <span>College</span>
        <select
          className="delegate-form-select"
          value={collegeId}
          onChange={(e) => setCollegeId(e.target.value)}
        >
          <option value="">Select college</option>
          {colleges.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name} ({c.code})
            </option>
          ))}
        </select>
      </label>

      {/* School — shown after college is selected */}
      {schools.length > 0 && (
        <label className="delegate-form-label">
          <span>School</span>
          <select
            className="delegate-form-select"
            value={schoolId}
            onChange={(e) => setSchoolId(e.target.value)}
          >
            <option value="">Select school</option>
            {schools.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name} ({s.code})
              </option>
            ))}
          </select>
        </label>
      )}

      {/* Department — shown after school is selected */}
      {departments.length > 0 && (
        <label className="delegate-form-label">
          <span>Department</span>
          <select
            className="delegate-form-select"
            value={departmentId}
            onChange={(e) => setDepartmentId(e.target.value)}
          >
            <option value="">Select department</option>
            {departments.map((d) => (
              <option key={d.id} value={d.id}>
                {d.name}
              </option>
            ))}
          </select>
        </label>
      )}

      <Input label="Phone" value={phone} onChange={(e) => setPhone(e.target.value)} />

      <label className="delegate-form-label">
        <span>Initial status</span>
        <select
          className="delegate-form-select"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        >
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