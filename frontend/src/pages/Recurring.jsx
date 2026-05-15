import React, { useState } from 'react';
import { CalendarClock, Plus, X } from 'lucide-react';

function Recurring() {
  const [bills, setBills] = useState([
    { id: 1, title: 'Apartment Rent', date: '1st', amount: 25000, color: 'red' },
    { id: 2, title: 'Gym Membership', date: '5th', amount: 1500, color: 'blue' },
    { id: 3, title: 'Car Loan EMI', date: '12th', amount: 12400, color: 'purple' },
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDate, setNewDate] = useState('');
  const [newAmount, setNewAmount] = useState('');

  const handleAddBill = () => {
    if (!newTitle || !newDate || !newAmount) return;
    setBills([...bills, {
      id: Date.now(),
      title: newTitle,
      date: newDate,
      amount: Number(newAmount),
      color: 'green'
    }]);
    setIsModalOpen(false);
    setNewTitle('');
    setNewDate('');
    setNewAmount('');
  };

  return (
    <div>
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1>Fixed Monthly Expenses</h1>
          <p>Manage your rent, EMIs, and subscriptions.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="glass-panel" 
          style={{ padding: '0.75rem 1.5rem', display: 'flex', gap: '0.5rem', cursor: 'pointer', color: 'var(--accent-blue)', border: '1px solid var(--accent-blue)', background: 'transparent' }}
        >
          <Plus size={20} /> Add Bill
        </button>
      </div>

      <div className="glass-panel" style={{ padding: '2rem', position: 'relative' }}>
        <div className="item-list">
          {bills.map(bill => (
            <div className="list-item" key={bill.id}>
              <div className="item-left">
                <div className={`icon-wrapper icon-${bill.color}`}><CalendarClock size={20}/></div>
                <div>
                  <div className="item-title">{bill.title}</div>
                  <div className="item-subtitle">Due on {bill.date} of every month</div>
                </div>
              </div>
              <div style={{fontWeight: 'bold', fontSize: '1.2rem'}}>₹{bill.amount.toLocaleString()}</div>
            </div>
          ))}
        </div>

        {/* Modal Overlay */}
        {isModalOpen && (
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)', display: 'flex', justifyContent: 'center', alignItems: 'center', borderRadius: '20px', zIndex: 10 }}>
            <div style={{ background: '#1e293b', padding: '2rem', borderRadius: '16px', border: '1px solid #334155', width: '350px', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.5)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem', alignItems: 'center' }}>
                <h3 style={{ margin: 0 }}>New Recurring Bill</h3>
                <X style={{ cursor: 'pointer', color: '#94a3b8' }} onClick={() => setIsModalOpen(false)} />
              </div>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <input placeholder="Bill Name (e.g. Netflix)" value={newTitle} onChange={e => setNewTitle(e.target.value)} style={{ padding: '0.75rem', borderRadius: '8px', border: '1px solid #334155', background: '#0f172a', color: 'white' }} />
                <input placeholder="Due Date (e.g. 15th)" value={newDate} onChange={e => setNewDate(e.target.value)} style={{ padding: '0.75rem', borderRadius: '8px', border: '1px solid #334155', background: '#0f172a', color: 'white' }} />
                <input type="number" placeholder="Amount (₹)" value={newAmount} onChange={e => setNewAmount(e.target.value)} style={{ padding: '0.75rem', borderRadius: '8px', border: '1px solid #334155', background: '#0f172a', color: 'white' }} />
                <button onClick={handleAddBill} style={{ padding: '0.75rem', background: 'var(--accent-blue)', color: '#0f172a', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', marginTop: '0.5rem' }}>Save Bill</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Recurring;
