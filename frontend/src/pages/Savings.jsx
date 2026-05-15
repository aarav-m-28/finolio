import React, { useState } from 'react';
import { Target, Plus, X, Wallet } from 'lucide-react';
import { useGlobalContext } from '../context/GlobalState';

function Savings() {
  const { goals, addGoal, addMoneyToGoal } = useGlobalContext();

  const [isGoalModalOpen, setIsGoalModalOpen] = useState(false);
  const [isAddMoneyModalOpen, setIsAddMoneyModalOpen] = useState(false);
  const [activeGoalId, setActiveGoalId] = useState(null);
  
  const [newTitle, setNewTitle] = useState('');
  const [newTarget, setNewTarget] = useState('');
  const [addAmount, setAddAmount] = useState('');

  const handleAddGoal = () => {
    if (!newTitle || !newTarget) return;
    addGoal({
      title: newTitle,
      target: Number(newTarget),
      color: 'green'
    });
    setIsGoalModalOpen(false);
    setNewTitle('');
    setNewTarget('');
  };

  const handleAddMoney = () => {
    if (!addAmount) return;
    addMoneyToGoal(activeGoalId, addAmount);
    setIsAddMoneyModalOpen(false);
    setAddAmount('');
  };

  const openAddMoney = (id) => {
    setActiveGoalId(id);
    setIsAddMoneyModalOpen(true);
  };

  return (
    <div style={{ position: 'relative' }}>
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1>Savings Goals</h1>
          <p>Money added here will be deducted from your main balance.</p>
        </div>
        <button 
          onClick={() => setIsGoalModalOpen(true)}
          className="glass-panel" 
          style={{ padding: '0.75rem 1.5rem', display: 'flex', gap: '0.5rem', cursor: 'pointer', color: 'var(--accent-blue)', border: '1px solid var(--accent-blue)', background: 'transparent' }}
        >
          <Plus size={20} /> New Goal
        </button>
      </div>

      <div className="dashboard-grid">
        {goals.map(goal => {
          const percent = Math.min(100, Math.round((goal.current / goal.target) * 100));
          return (
            <div className="glass-panel stat-card" key={goal.id}>
              <div className="stat-header">
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                  <div className={`icon-wrapper icon-${goal.color}`}><Target size={24}/></div>
                  <span className="item-title">{goal.title}</span>
                </div>
                <span style={{color: `var(--accent-${goal.color})`, fontWeight: 'bold'}}>{percent}%</span>
              </div>
              <div style={{ marginTop: '1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                  <span>₹{goal.current.toLocaleString()} saved</span>
                  <span>Goal: ₹{goal.target.toLocaleString()}</span>
                </div>
                <div className="progress-container">
                  <div className="progress-bar" style={{ width: `${percent}%`, background: `var(--accent-${goal.color})` }}></div>
                </div>
              </div>
              <button 
                onClick={() => openAddMoney(goal.id)}
                style={{ marginTop: '1.5rem', padding: '0.75rem', borderRadius: '12px', border: 'none', background: 'rgba(255,255,255,0.05)', color: 'white', cursor: 'pointer', border: '1px solid rgba(255,255,255,0.1)' }}
              >
                + Add Money
              </button>
            </div>
          )
        })}
      </div>

      {/* New Goal Modal */}
      {isGoalModalOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 100 }}>
          <div style={{ background: '#1e293b', padding: '2rem', borderRadius: '16px', border: '1px solid #334155', width: '350px', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.5)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem', alignItems: 'center' }}>
              <h3 style={{ margin: 0 }}>Create New Goal</h3>
              <X style={{ cursor: 'pointer', color: '#94a3b8' }} onClick={() => setIsGoalModalOpen(false)} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <input placeholder="Goal Name (e.g. New Car)" value={newTitle} onChange={e => setNewTitle(e.target.value)} style={{ padding: '0.75rem', borderRadius: '8px', border: '1px solid #334155', background: '#0f172a', color: 'white' }} />
              <input type="number" placeholder="Target Amount (₹)" value={newTarget} onChange={e => setNewTarget(e.target.value)} style={{ padding: '0.75rem', borderRadius: '8px', border: '1px solid #334155', background: '#0f172a', color: 'white' }} />
              <button onClick={handleAddGoal} style={{ padding: '0.75rem', background: 'var(--accent-blue)', color: '#0f172a', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', marginTop: '0.5rem' }}>Create Goal</button>
            </div>
          </div>
        </div>
      )}

      {/* Add Money Modal */}
      {isAddMoneyModalOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 100 }}>
          <div style={{ background: '#1e293b', padding: '2rem', borderRadius: '16px', border: '1px solid #334155', width: '350px', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.5)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem', alignItems: 'center' }}>
              <h3 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Wallet size={20}/> Add to Savings</h3>
              <X style={{ cursor: 'pointer', color: '#94a3b8' }} onClick={() => setIsAddMoneyModalOpen(false)} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <p style={{ margin: 0, color: '#94a3b8', fontSize: '0.85rem' }}>This amount will be deducted from your main Dashboard balance.</p>
              <input type="number" placeholder="Amount to add (₹)" value={addAmount} onChange={e => setAddAmount(e.target.value)} style={{ padding: '0.75rem', borderRadius: '8px', border: '1px solid #334155', background: '#0f172a', color: 'white' }} />
              <button onClick={handleAddMoney} style={{ padding: '0.75rem', background: 'var(--accent-green)', color: '#0f172a', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', marginTop: '0.5rem' }}>Transfer Money</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Savings;
