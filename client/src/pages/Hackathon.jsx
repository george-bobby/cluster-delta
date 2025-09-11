import React, { useEffect, useMemo, useState } from "react";
import { TopBar, Loading } from "../components";
import { useSelector } from "react-redux";
import { BACKEND_URL } from "../utils/api";

const TabButton = ({ label, active, onClick }) => (
  <button
    onClick={onClick}
    className={`px-4 py-2 rounded-full text-sm mr-2 ${active ? "bg-black text-white" : "bg-gray-200 dark:bg-base-200"}`}
  >
    {label}
  </button>
);

export default function Hackathon() {
  const { user } = useSelector((s) => s.user);
  const token = user?.token;
  const [tab, setTab] = useState("hackathons");
  const [loading, setLoading] = useState(false);
  const [hackathons, setHackathons] = useState([]);
  const [selectedHackathon, setSelectedHackathon] = useState(null);
  const [teams, setTeams] = useState([]);
  const [myTeams, setMyTeams] = useState([]);
  const [search, setSearch] = useState("");
  const [skillFilter, setSkillFilter] = useState("");

  const headers = useMemo(() => ({
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  }), [token]);

  useEffect(() => {
    const fetchHackathons = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${BACKEND_URL}/hackathons`);
        const data = await res.json();
        setHackathons(data?.data || []);
      } catch (e) {}
      setLoading(false);
    };
    fetchHackathons();
  }, []);

  useEffect(() => {
    if (tab === "my") {
      (async () => {
        try {
          const res = await fetch(`${BACKEND_URL}/teams/my-teams`, { headers });
          const data = await res.json();
          setMyTeams(data?.data || []);
        } catch (e) {}
      })();
    }
  }, [tab, headers]);

  useEffect(() => {
    if (tab === "teams" && selectedHackathon?._id) {
      (async () => {
        try {
          const res = await fetch(`${BACKEND_URL}/teams/hackathon/${selectedHackathon._id}`);
          const data = await res.json();
          setTeams(data?.data || []);
        } catch (e) {}
      })();
    }
  }, [tab, selectedHackathon]);

  const filteredTeams = useMemo(() => {
    const key = search.trim().toLowerCase();
    const skill = skillFilter.trim().toLowerCase();
    return (teams || []).filter((t) => {
      const text = `${t?.name || ""} ${t?.description || ""} ${t?.projectIdea || ""}`.toLowerCase();
      const skills = (t?.requiredSkills || []).join(" ").toLowerCase();
      return (!key || text.includes(key)) && (!skill || skills.includes(skill));
    });
  }, [teams, search, skillFilter]);

  const onCreateTeam = async (payload) => {
    if (!selectedHackathon) return;
    const body = JSON.stringify({ ...payload, hackathonId: selectedHackathon._id });
    const res = await fetch(`${BACKEND_URL}/teams`, { method: "POST", headers, body });
    if (res.ok) {
      const data = await res.json();
      setTeams((prev) => [data.data, ...prev]);
    }
  };

  const onRequestJoin = async (teamId, form) => {
    const body = JSON.stringify(form);
    await fetch(`${BACKEND_URL}/teams/${teamId}/request`, { method: "POST", headers, body });
  };

  return (
    <div className="w-full px-0 lg:px-10 pb-20 2xl:px-40 bg-[#ffffff] dark:bg-base-100 lg:rounded-lg min-h-screen">
      <TopBar />
      <div className="px-4 lg:px-2 mt-4">
        <div className="flex items-center mb-4">
          <TabButton label="Hackathons" active={tab === "hackathons"} onClick={() => setTab("hackathons")} />
          <TabButton label="Teams" active={tab === "teams"} onClick={() => setTab("teams")} />
          <TabButton label="My Teams" active={tab === "my"} onClick={() => setTab("my")} />
        </div>

        {tab === "hackathons" && (
          <div>
            {loading ? (
              <Loading />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {hackathons.map((h) => (
                  <div key={h._id} className="p-4 rounded-lg border dark:border-base-300">
                    <div className="font-semibold text-lg">{h.name}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">{h.description}</div>
                    <div className="text-xs mt-2">{new Date(h.startDate).toLocaleDateString()} - {new Date(h.endDate).toLocaleDateString()}</div>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {(h.tags || []).map((t) => (
                        <span key={t} className="text-xs px-2 py-1 rounded-full bg-gray-200 dark:bg-base-200">{t}</span>
                      ))}
                    </div>
                    <button onClick={() => { setSelectedHackathon(h); setTab("teams"); }} className="mt-3 px-3 py-2 rounded-full bg-black text-white text-sm">View Teams</button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {tab === "teams" && (
          <div>
            <div className="flex flex-col md:flex-row md:items-center gap-2 mb-3">
              <select value={selectedHackathon?._id || ""} onChange={(e) => {
                const h = hackathons.find((x) => x._id === e.target.value);
                setSelectedHackathon(h || null);
              }} className="input input-bordered w-full md:w-1/3 h-10">
                <option value="">Select hackathon</option>
                {hackathons.map((h) => (
                  <option key={h._id} value={h._id}>{h.name}</option>
                ))}
              </select>
              <input placeholder="Search teams" value={search} onChange={(e) => setSearch(e.target.value)} className="input input-bordered w-full h-10" />
              <input placeholder="Filter skill" value={skillFilter} onChange={(e) => setSkillFilter(e.target.value)} className="input input-bordered w-full h-10" />
            </div>

            {selectedHackathon && (
              <div className="mb-4 p-4 rounded-lg border dark:border-base-300">
                <div className="font-medium mb-2">Create a Team</div>
                <TeamCreateForm onSubmit={onCreateTeam} />
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {filteredTeams.map((t) => (
                <div key={t._id} className="p-4 rounded-lg border dark:border-base-300">
                  <div className="font-semibold text-lg">{t.name}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">{t.description}</div>
                  <div className="text-xs mt-2">Required: {(t.requiredSkills || []).join(", ")}</div>
                  <div className="text-xs mt-1">Tech: {(t.technologies || []).join(", ")}</div>
                  <div className="text-xs mt-1">Max size: {t.maxSize} • {t.isOpen ? "Open" : "Closed"}</div>
                  <div className="mt-3">
                    <JoinRequestForm onSubmit={(form) => onRequestJoin(t._id, form)} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {tab === "my" && (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {myTeams.map((t) => (
              <div key={t._id} className="p-4 rounded-lg border dark:border-base-300">
                <div className="font-semibold text-lg">{t.name}</div>
                <div className="text-xs mt-1">Status: {t.isOpen ? "Open" : "Closed"}</div>
                <div className="text-xs mt-2">Members: {t.members?.length || 1} / {t.maxSize}</div>
                <TeamManagePanel team={t} canManage={String(t.createdBy) === String(user?._id)} onTeamUpdated={(updated)=>setMyTeams((prev)=>prev.map(x=>x._id===updated._id?updated:x))} />
                <TeamRequestsPanel teamId={t._id} isOwner={String(t.createdBy) === String(user?._id)} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function TeamCreateForm({ onSubmit }) {
  const [form, setForm] = useState({ name: "", description: "", requiredSkills: "", technologies: "", projectIdea: "", maxSize: 4, isOpen: true });
  return (
    <div className="flex flex-col md:flex-row gap-2">
      <input className="input input-bordered h-10 w-full" placeholder="Team name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
      <input className="input input-bordered h-10 w-full" placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
      <input className="input input-bordered h-10 w-full" placeholder="Required skills (comma)" value={form.requiredSkills} onChange={(e) => setForm({ ...form, requiredSkills: e.target.value })} />
      <input className="input input-bordered h-10 w-full" placeholder="Technologies (comma)" value={form.technologies} onChange={(e) => setForm({ ...form, technologies: e.target.value })} />
      <input className="input input-bordered h-10 w-full" placeholder="Project idea" value={form.projectIdea} onChange={(e) => setForm({ ...form, projectIdea: e.target.value })} />
      <input type="number" min={1} className="input input-bordered h-10 w-24" placeholder="Max" value={form.maxSize} onChange={(e) => setForm({ ...form, maxSize: Number(e.target.value || 1) })} />
      <button className="px-3 py-2 rounded-full bg-black text-white text-sm" onClick={() => onSubmit({ ...form, requiredSkills: splitCsv(form.requiredSkills), technologies: splitCsv(form.technologies) })}>Create</button>
    </div>
  );
}

function JoinRequestForm({ onSubmit }) {
  const [form, setForm] = useState({ message: "", skillsShowcase: "", experienceLevel: "beginner", portfolioLinks: "" });
  return (
    <div className="flex flex-col gap-2">
      <input className="input input-bordered h-10 w-full" placeholder="Message" value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} />
      <input className="input input-bordered h-10 w-full" placeholder="Skills showcase (comma)" value={form.skillsShowcase} onChange={(e) => setForm({ ...form, skillsShowcase: e.target.value })} />
      <select className="input input-bordered h-10 w-full" value={form.experienceLevel} onChange={(e) => setForm({ ...form, experienceLevel: e.target.value })}>
        <option value="beginner">Beginner</option>
        <option value="intermediate">Intermediate</option>
        <option value="advanced">Advanced</option>
        <option value="expert">Expert</option>
      </select>
      <input className="input input-bordered h-10 w-full" placeholder="Portfolio links (comma)" value={form.portfolioLinks} onChange={(e) => setForm({ ...form, portfolioLinks: e.target.value })} />
      <button className="px-3 py-2 rounded-full bg-black text-white text-sm" onClick={() => onSubmit({ ...form, skillsShowcase: splitCsv(form.skillsShowcase), portfolioLinks: splitCsv(form.portfolioLinks) })}>Request to Join</button>
    </div>
  );
}

function TeamRequestsPanel({ teamId, isOwner }) {
  const { user } = useSelector((s) => s.user);
  const token = user?.token;
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    if (!isOwner) return;
    (async () => {
      try {
        const res = await fetch(`${BACKEND_URL}/teams/${teamId}/requests`, { headers: { Authorization: `Bearer ${token}` } });
        const data = await res.json();
        setRequests(data?.data || []);
      } catch (e) {}
    })();
  }, [teamId, isOwner, token]);

  const act = async (requestId, status) => {
    const res = await fetch(`${BACKEND_URL}/teams/requests/${requestId}`, { method: "PUT", headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` }, body: JSON.stringify({ status }) });
    if (res.ok) {
      setRequests((prev) => prev.map((r) => (r._id === requestId ? { ...r, status } : r)));
    }
  };

  if (!isOwner) return null;
  return (
    <div className="mt-3">
      <div className="font-medium mb-2">Join Requests</div>
      <div className="flex flex-col gap-2">
        {requests.map((r) => (
          <div key={r._id} className="p-3 rounded-lg border dark:border-base-300">
            <div className="text-sm font-medium">{r?.requesterId?.firstName} {r?.requesterId?.lastName}</div>
            <div className="text-xs mt-1">{(r?.skillsShowcase || []).join(", ")}</div>
            <div className="text-xs">{r?.experienceLevel}</div>
            <div className="flex gap-2 mt-2">
              <button className="px-3 py-1 rounded-full bg-black text-white text-xs" onClick={() => act(r._id, "accepted")}>Accept</button>
              <button className="px-3 py-1 rounded-full bg-gray-200 dark:bg-base-200 text-xs" onClick={() => act(r._id, "rejected")}>Reject</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function splitCsv(v) {
  return (v || "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}


function TeamManagePanel({ team, canManage, onTeamUpdated }) {
  const { user } = useSelector((s) => s.user);
  const token = user?.token;
  const [localTeam, setLocalTeam] = useState(team);

  useEffect(() => setLocalTeam(team), [team]);

  if (!canManage) return null;

  const toggleOpen = async () => {
    const body = JSON.stringify({ isOpen: !localTeam.isOpen });
    const res = await fetch(`${BACKEND_URL}/teams/${localTeam._id}`, { method: "PUT", headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` }, body });
    if (res.ok) {
      const data = await res.json();
      setLocalTeam(data.data);
      onTeamUpdated?.(data.data);
    }
  };

  const removeMember = async (memberUserId) => {
    const remaining = (localTeam.members || []).filter((m) => String(m.userId) !== String(memberUserId));
    const body = JSON.stringify({ members: remaining });
    const res = await fetch(`${BACKEND_URL}/teams/${localTeam._id}`, { method: "PUT", headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` }, body });
    if (res.ok) {
      const data = await res.json();
      setLocalTeam(data.data);
      onTeamUpdated?.(data.data);
    }
  };

  return (
    <div className="mt-3">
      <div className="flex items-center justify-between">
        <div className="font-medium">Manage Team</div>
        <button className="px-3 py-1 rounded-full bg-gray-200 dark:bg-base-200 text-xs" onClick={toggleOpen}>{localTeam.isOpen ? "Close Team" : "Open Team"}</button>
      </div>
      <div className="mt-2 flex flex-col gap-1">
        {(localTeam.members || []).map((m) => (
          <div key={String(m.userId)} className="text-xs flex items-center justify-between">
            <span>{String(m.role || 'member')}</span>
            <button className="px-2 py-1 rounded-full bg-gray-200 dark:bg-base-200" onClick={() => removeMember(m.userId)}>Remove</button>
          </div>
        ))}
      </div>
    </div>
  );
}


