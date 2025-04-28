import { useEffect, useState } from 'react';
import CampaignFormModal from '../components/CampaignFormModal';
import CampaignModal from '../components/CampaignModal';
import LaunchCampaignModal from './LaunchCampaignModal';

const CampaignPlanList = () => {
  const [plans, setPlans] = useState([]);
  const [formOpen, setFormOpen] = useState(false);
  const [selectedPlanId, setSelectedPlanId] = useState(null);
  const [editingPlan, setEditingPlan] = useState(null);
  const [launchModalOpen, setLaunchModalOpen] = useState(false);
  const [campaignToLaunch, setCampaignToLaunch] = useState(null);


  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    try {
      const res = await fetch('/api/campaigns', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      const data = await res.json();
      setPlans(data);
    } catch (err) {
      console.error('❌ Error fetching plans:', err);
    }
  };

  const statusColors = {
    DRAFT: 'bg-gray-400 text-white',
    SCHEDULED: 'bg-yellow-500 text-white',
    ACTIVE: 'bg-green-600 text-white',
    PAUSED: 'bg-blue-500 text-white',
    COMPLETED: 'bg-purple-600 text-white',
  };

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">📢 Campaign Plans ({plans.length})</h2>
        <button
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          onClick={() => {
            setEditingPlan(null); // reset editing state
            setFormOpen(true);
          }}
        >
          ➕ New Plan
        </button>
      </div>

      {plans.length === 0 ? (
        <p>No plans yet.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full border text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-2 text-left">Name</th>
                <th className="p-2 text-left">Goal</th>
                <th className="p-2 text-left">Platform</th>
                <th className="p-2 text-left">Budget</th>
                <th className="p-2 text-left">Status</th>
                <th className="p-2 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {plans.map((plan) => (
                <tr
                  key={plan.id}
                  className="border-b hover:bg-gray-50 cursor-pointer"
                  onClick={() => setSelectedPlanId(plan.id)}
                >
                  <td className="p-2">{plan.name}</td>
                  <td className="p-2">{plan.goal}</td>
                  <td className="p-2">{plan.platform}</td>
                  <td className="p-2">${plan.budget}</td>
                  <td className="p-2">
                    <span
                      className={`px-2 py-1 rounded text-xs font-semibold ${
                        statusColors[plan.status] || 'bg-gray-300 text-black'
                      }`}
                    >
                      {plan.status
                        ? plan.status.charAt(0).toUpperCase() + plan.status.slice(1).toLowerCase()
                        : 'Draft'}
                    </span>
                  </td>
                  <td className="p-2 flex gap-2">
                    {plan.status === 'DRAFT' && (
                      <>
                        <button
                          className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
                          onClick={(e) => {
                            e.stopPropagation();
                            setCampaignToLaunch(plan);
                            setLaunchModalOpen(true);
                          }}
                        >
                          🚀 Launch
                        </button>
                        <button
                          className="bg-gray-700 text-white px-3 py-1 rounded hover:bg-gray-800"
                          onClick={(e) => {
                            e.stopPropagation();
                            setEditingPlan(plan);
                            setFormOpen(true);
                          }}
                        >
                          ✏️ Edit
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <CampaignFormModal
        open={formOpen}
        onClose={() => {
          setFormOpen(false);
          setEditingPlan(null);
        }}
        onCreated={() => {
          fetchPlans();
          setFormOpen(false);
        }}
        initialData={editingPlan}
      />
        <CampaignModal
        open={!!selectedPlanId}
        campaignId={selectedPlanId}
        handleClose={() => {
            setSelectedPlanId(null);         // reset modal
            setTimeout(() => fetchPlans(), 300); // slight delay before fetching
        }}
        onDeleted={() => {
            fetchPlans();
            setSelectedPlanId(null);        // close modal after delete
        }}
        onUpdated={() => {
            fetchPlans();
            setSelectedPlanId(null);        // close modal after update
        }}
        />
        <LaunchCampaignModal
            open={launchModalOpen}
            onClose={() => {
                setLaunchModalOpen(false);
                setCampaignToLaunch(null);
            }}
            campaign={campaignToLaunch}
            onLaunch={async ({ scheduledAt }) => {
                try {
                const res = await fetch(`/api/campaigns/launch/${campaignToLaunch.id}`, {
                    method: 'POST',
                    headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                    body: JSON.stringify(scheduledAt ? { scheduledAt } : {})
                });

                const data = await res.json();

                if (res.ok) {
                    alert('✅ Campaign launched successfully!');
                    fetchPlans();
                } else {
                    alert('❌ Failed to launch campaign.');
                    console.error(data.error);
                }
                } catch (err) {
                console.error('❌ Error launching campaign:', err);
                alert('Error launching campaign.');
                }
            }}
            />
    </div>
  );
};

export default CampaignPlanList;

