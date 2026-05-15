import React, { useState } from 'react';
import { Users, CheckCircle2, Circle, Plus, X, UserPlus, CheckSquare, Square, Trash2 } from 'lucide-react';
import { useGlobalContext } from '../context/GlobalState';

function Splits() {
  const { splits, addSplit, togglePaid, deleteSplit } = useGlobalContext();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newTotal, setNewTotal] = useState('');
  
  // "Me" State
  const [includeMe, setIncludeMe] = useState(true);
  
  // Dynamic people list
  const [newPeople, setNewPeople] = useState([{ id: Date.now(), name: '', amount: '', isManual: false }]);

  // ----- SPLIT MATH LOGIC -----
  const manualSum = newPeople.filter(p => p.isManual).reduce((sum, p) => sum + Number(p.amount), 0);
  const remainingAmount = Number(newTotal) - manualSum;
  const autoPeopleCount = newPeople.filter(p => !p.isManual).length + (includeMe ? 1 : 0);
  const autoSplitAmount = autoPeopleCount > 0 ? (remainingAmount / autoPeopleCount) : 0;
  const displayAutoSplit = Math.max(0, autoSplitAmount).toFixed(2);

  const handleAddPersonRow = () => {
    setNewPeople([...newPeople, { id: Date.now(), name: '', amount: '', isManual: false }]);
  };

  const updatePersonName = (id, value) => {
    setNewPeople(newPeople.map(p => p.id === id ? { ...p, name: value } : p));
  };

  const updatePersonAmount = (id, value) => {
    setNewPeople(newPeople.map(p => {
      if (p.id === id) {
        if (value === '') {
          return { ...p, amount: '', isManual: false }; // Revert to auto-split
        } else {
          return { ...p, amount: value, isManual: true }; // Manual override
        }
      }
      return p;
    }));
  };

  const removePersonRow = (id) => {
    if (newPeople.length > 1) {
      setNewPeople(newPeople.filter(p => p.id !== id));
    }
  };

  const handleAddSplit = () => {
    if (!newTitle || !newTotal) return;
    
    // Calculate final amounts for everyone
    const processedPeople = newPeople.map(p => ({
      id: p.id,
      name: p.name || 'Unknown Friend',
      amount: p.isManual ? Number(p.amount) : Number(displayAutoSplit),
      paid: false
    }));

    // Save to Global State
    addSplit({
      title: newTitle,
      totalAmount: Number(newTotal),
      myShare: includeMe ? Number(displayAutoSplit) : 0,
      people: processedPeople
    });
    
    // Reset Modal
    setIsModalOpen(false);
    setNewTitle('');
    setNewTotal('');
    setIncludeMe(true);
    setNewPeople([{ id: Date.now(), name: '', amount: '', isManual: false }]);
  };

  return (
    <div>
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1>Group Split Bills</h1>
          <p>Track group expenses. Refunds instantly sync to Dashboard!</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="glass-panel" 
          style={{ padding: '0.75rem 1.5rem', display: 'flex', gap: '0.5rem', cursor: 'pointer', color: 'var(--accent-blue)', border: '1px solid var(--accent-blue)', background: 'transparent' }}
        >
          <Plus size={20} /> New Group Bill
        </button>
      </div>

      <div className="glass-panel" style={{ padding: '2rem', position: 'relative' }}>
        <div className="item-list">
          {splits.map(split => (
            <div className="list-item" key={split.id} style={{ flexDirection: 'column', alignItems: 'stretch', gap: '1rem' }}>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '1rem' }}>
                <div className="item-left">
                  <div className="icon-wrapper icon-blue"><Users size={20}/></div>
                  <div>
                    <div className="item-title">{split.title}</div>
                    <div className="item-subtitle">Total Bill: ₹{split.totalAmount.toLocaleString()}</div>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  {split.myShare > 0 && (
                    <div style={{ background: 'rgba(56, 189, 248, 0.1)', color: 'var(--accent-blue)', padding: '0.5rem 1rem', borderRadius: '99px', fontSize: '0.9rem', fontWeight: 'bold' }}>
                      My Share: ₹{split.myShare.toLocaleString()}
                    </div>
                  )}
                  <Trash2 
                    size={18} 
                    color="#f87171" 
                    style={{ cursor: 'pointer', opacity: 0.7 }} 
                    onClick={() => deleteSplit(split.id)}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', paddingLeft: '3.5rem' }}>
                {split.people.map(person => (
                  <div key={person.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(0,0,0,0.2)', padding: '0.75rem 1rem', borderRadius: '8px' }}>
                    <div>
                      <strong style={{color: 'white'}}>{person.name}</strong> owes ₹{Number(person.amount).toLocaleString()}
                    </div>
                    
                    <div 
                      className={`split-check ${person.paid ? 'split-paid' : 'split-unpaid'}`}
                      onClick={() => togglePaid(split.id, person.id)}
                      style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem', padding: '0.25rem 0.75rem' }}
                    >
                      {person.paid ? <CheckCircle2 size={16} /> : <Circle size={16} />}
                      {person.paid ? 'Settled Up' : 'Waiting'}
                    </div>
                  </div>
                ))}
              </div>

            </div>
          ))}
          {splits.length === 0 && <p style={{ color: '#94a3b8' }}>No split bills yet.</p>}
        </div>

        {/* --- DYNAMIC SPLIT MATH MODAL --- */}
        {isModalOpen && (
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)', display: 'flex', justifyContent: 'center', alignItems: 'center', borderRadius: '20px', zIndex: 10 }}>
            <div style={{ background: '#1e293b', padding: '2rem', borderRadius: '16px', border: '1px solid #334155', width: '450px', maxHeight: '80vh', overflowY: 'auto', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.5)' }}>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem', alignItems: 'center' }}>
                <h3 style={{ margin: 0 }}>Create Group Split</h3>
                <X style={{ cursor: 'pointer', color: '#94a3b8' }} onClick={() => setIsModalOpen(false)} />
              </div>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <input placeholder="Bill Name (e.g. Pizza)" value={newTitle} onChange={e => setNewTitle(e.target.value)} style={{ padding: '0.75rem', borderRadius: '8px', border: '1px solid #334155', background: '#0f172a', color: 'white' }} />
                <input type="number" placeholder="Total Bill Amount (₹)" value={newTotal} onChange={e => setNewTotal(e.target.value)} style={{ padding: '0.75rem', borderRadius: '8px', border: '1px solid #334155', background: '#0f172a', color: 'white' }} />
                
                <hr style={{ borderColor: '#334155', width: '100%', margin: '0.5rem 0' }}/>
                
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h4 style={{ margin: 0, color: '#94a3b8' }}>Split Details</h4>
                  
                  {/* INCLUDE ME CHECKBOX */}
                  <div 
                    onClick={() => setIncludeMe(!includeMe)} 
                    style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', color: includeMe ? 'var(--accent-blue)' : '#94a3b8', fontSize: '0.9rem' }}
                  >
                    {includeMe ? <CheckSquare size={18} /> : <Square size={18} />}
                    Include Me in Split
                  </div>
                </div>

                {/* "ME" ROW */}
                {includeMe && (
                  <div style={{ display: 'flex', gap: '0.5rem', opacity: 0.8 }}>
                    <input disabled value="Me (My Share)" style={{ flex: 1, padding: '0.5rem', borderRadius: '8px', border: '1px solid #334155', background: '#0f172a', color: 'var(--accent-blue)' }} />
                    <input disabled value={newTotal ? `₹${displayAutoSplit}` : ''} style={{ width: '120px', padding: '0.5rem', borderRadius: '8px', border: '1px solid #334155', background: '#0f172a', color: 'var(--accent-blue)', textAlign: 'right' }} />
                  </div>
                )}

                {/* FRIEND ROWS */}
                {newPeople.map((person) => (
                  <div key={person.id} style={{ display: 'flex', gap: '0.5rem' }}>
                    <input 
                      placeholder="Friend's Name" 
                      value={person.name} 
                      onChange={e => updatePersonName(person.id, e.target.value)} 
                      style={{ flex: 1, padding: '0.5rem', borderRadius: '8px', border: '1px solid #334155', background: '#0f172a', color: 'white' }} 
                    />
                    <input 
                      type="number" 
                      placeholder={newTotal ? `₹${displayAutoSplit}` : "Amount"} 
                      value={person.isManual ? person.amount : ''} 
                      onChange={e => updatePersonAmount(person.id, e.target.value)} 
                      style={{ width: '120px', padding: '0.5rem', borderRadius: '8px', border: '1px solid #334155', background: '#0f172a', color: 'white', textAlign: 'right' }} 
                    />
                    {newPeople.length > 1 && (
                      <button onClick={() => removePersonRow(person.id)} style={{ padding: '0.5rem', background: 'transparent', border: 'none', color: '#f87171', cursor: 'pointer' }}>
                        <X size={20} />
                      </button>
                    )}
                  </div>
                ))}

                <button 
                  onClick={handleAddPersonRow} 
                  style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', padding: '0.5rem', background: 'rgba(255,255,255,0.05)', color: 'var(--accent-blue)', border: '1px dashed var(--accent-blue)', borderRadius: '8px', cursor: 'pointer' }}
                >
                  <UserPlus size={16} /> Add Another Friend
                </button>

                <button onClick={handleAddSplit} style={{ padding: '1rem', background: 'var(--accent-blue)', color: '#0f172a', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', marginTop: '1rem', fontSize: '1.1rem' }}>
                  Save Group Bill
                </button>
              </div>

            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Splits;
