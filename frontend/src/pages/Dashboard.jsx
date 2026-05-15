import React, { useState } from 'react';
import { ArrowUpRight, ArrowDownRight, Wallet, Activity, Plus, X, Trash2 } from 'lucide-react';
import { useGlobalContext } from '../context/GlobalState';

function Dashboard() {
  const { balance, transactions, addTransaction, deleteTransaction, addSplit } = useGlobalContext();
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState('expense');
  
  // Split Integration inside Dashboard!
  const [isSplit, setIsSplit] = useState(false);
  const [friendName, setFriendName] = useState('');

  const incomeThisMonth = transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
  const expensesThisMonth = transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);

  const handleSave = () => {
    if (!title || !amount) return;

    if (isSplit && type === 'expense') {
      // Create a fast 50/50 split automatically
      const half = Number(amount) / 2;
      addSplit({
        title: title,
        totalAmount: Number(amount),
        myShare: half,
        people: [{ id: Date.now(), name: friendName || 'Friend', amount: half, paid: false }]
      });
    } else {
      // Standard transaction
      addTransaction({ title, amount: Number(amount), type, date: 'Today' });
    }

    setIsModalOpen(false);
    setTitle('');
    setAmount('');
    setIsSplit(false);
    setFriendName('');
  };

  return (
    <div style={{ position: 'relative' }}>
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1>Overview</h1>
          <p>Your financial summary and analysis.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="glass-panel" 
          style={{ padding: '0.75rem 1.5rem', display: 'flex', gap: '0.5rem', cursor: 'pointer', color: 'var(--accent-blue)', border: '1px solid var(--accent-blue)', background: 'transparent' }}
        >
          <Plus size={20} /> Add Transaction
        </button>
      </div>

      <div className="dashboard-grid">
        <div className="glass-panel stat-card">
          <div className="stat-header">
            <span>Total Balance</span>
            <Wallet className="icon-blue" />
          </div>
          <div className="stat-value">₹{balance.toLocaleString()}</div>
        </div>

        <div className="glass-panel stat-card">
          <div className="stat-header">
            <span>Monthly Income</span>
            <ArrowUpRight className="icon-green" />
          </div>
          <div className="stat-value" style={{color: 'var(--accent-green)'}}>+₹{incomeThisMonth.toLocaleString()}</div>
        </div>

        <div className="glass-panel stat-card">
          <div className="stat-header">
            <span>Monthly Expenses</span>
            <ArrowDownRight className="icon-red" />
          </div>
          <div className="stat-value" style={{color: 'var(--accent-red)'}}>-₹{expensesThisMonth.toLocaleString()}</div>
        </div>
      </div>

      <div className="glass-panel" style={{ padding: '2rem' }}>
        <h3>Recent Transactions</h3>
        <div className="item-list" style={{ marginTop: '1.5rem' }}>
          {transactions.map(txn => (
            <div className="list-item" key={txn.id}>
              <div className="item-left">
                <div className={`icon-wrapper ${txn.type === 'income' ? 'icon-green' : 'icon-red'}`}>
                  <Activity size={20}/>
                </div>
                <div>
                  <div className="item-title">{txn.title}</div>
                  <div className="item-subtitle">{txn.type === 'income' ? 'Income' : 'Expense'} • {txn.date}</div>
                </div>
              </div>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                <div style={{fontWeight: 'bold', color: txn.type === 'income' ? 'var(--accent-green)' : 'var(--accent-red)'}}>
                  {txn.type === 'income' ? '+' : '-'}₹{txn.amount.toLocaleString()}
                </div>
                <Trash2 
                  size={18} 
                  color="#f87171" 
                  style={{ cursor: 'pointer', opacity: 0.7 }} 
                  onClick={() => deleteTransaction(txn.id, txn.type, txn.amount)}
                />
              </div>
            </div>
          ))}
          {transactions.length === 0 && <p style={{ color: '#94a3b8' }}>No transactions yet.</p>}
        </div>
      </div>

      {/* ADD TRANSACTION MODAL */}
      {isModalOpen && (
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)', display: 'flex', justifyContent: 'center', alignItems: 'center', borderRadius: '20px', zIndex: 10 }}>
          <div style={{ background: '#1e293b', padding: '2rem', borderRadius: '16px', border: '1px solid #334155', width: '350px', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.5)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem', alignItems: 'center' }}>
              <h3 style={{ margin: 0 }}>New Transaction</h3>
              <X style={{ cursor: 'pointer', color: '#94a3b8' }} onClick={() => setIsModalOpen(false)} />
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button 
                  onClick={() => setType('expense')} 
                  style={{ flex: 1, padding: '0.5rem', background: type === 'expense' ? 'var(--accent-red)' : 'transparent', color: type === 'expense' ? '#0f172a' : 'white', border: '1px solid var(--accent-red)', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>
                  Expense
                </button>
                <button 
                  onClick={() => { setType('income'); setIsSplit(false); }} 
                  style={{ flex: 1, padding: '0.5rem', background: type === 'income' ? 'var(--accent-green)' : 'transparent', color: type === 'income' ? '#0f172a' : 'white', border: '1px solid var(--accent-green)', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>
                  Income
                </button>
              </div>

              <input placeholder="What was it for?" value={title} onChange={e => setTitle(e.target.value)} style={{ padding: '0.75rem', borderRadius: '8px', border: '1px solid #334155', background: '#0f172a', color: 'white' }} />
              <input type="number" placeholder="Total Amount (₹)" value={amount} onChange={e => setAmount(e.target.value)} style={{ padding: '0.75rem', borderRadius: '8px', border: '1px solid #334155', background: '#0f172a', color: 'white' }} />
              
              {type === 'expense' && (
                <div style={{ padding: '1rem', background: 'rgba(255,255,255,0.05)', borderRadius: '8px', marginTop: '0.5rem' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                    <input type="checkbox" checked={isSplit} onChange={(e) => setIsSplit(e.target.checked)} style={{ transform: 'scale(1.2)' }} />
                    Was this a Split Bill?
                  </label>
                  
                  {isSplit && (
                    <div style={{ marginTop: '1rem' }}>
                      <p style={{ fontSize: '0.8rem', color: '#94a3b8', marginBottom: '0.5rem' }}>We will instantly split this 50/50 with:</p>
                      <input placeholder="Friend's Name" value={friendName} onChange={e => setFriendName(e.target.value)} style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #334155', background: '#0f172a', color: 'white' }} />
                    </div>
                  )}
                </div>
              )}

              <button onClick={handleSave} style={{ padding: '0.75rem', background: 'var(--accent-blue)', color: '#0f172a', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', marginTop: '0.5rem' }}>Save Transaction</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;
