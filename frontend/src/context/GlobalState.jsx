import React, { createContext, useState, useContext } from 'react';

const GlobalContext = createContext();
export const useGlobalContext = () => useContext(GlobalContext);

export const GlobalProvider = ({ children }) => {
  const [balance, setBalance] = useState(124500);
  
  const [transactions, setTransactions] = useState([
    { id: 1, title: 'Salary Credit', type: 'income', amount: 85000, date: 'Yesterday' },
    { id: 2, title: 'Starbucks Coffee', type: 'expense', amount: 450, date: 'Today' }
  ]);
  
  const [splits, setSplits] = useState([]);
  
  const [goals, setGoals] = useState([
    { id: 1, title: 'MacBook Pro M3', current: 90000, target: 150000, color: 'blue' },
    { id: 2, title: 'Bali Vacation', current: 20000, target: 80000, color: 'purple' }
  ]);

  // --- Transactions ---
  const addTransaction = (txn) => {
    setTransactions([{ ...txn, id: Date.now() }, ...transactions]);
    if (txn.type === 'expense') setBalance(prev => prev - txn.amount);
    if (txn.type === 'income') setBalance(prev => prev + txn.amount);
  };

  const deleteTransaction = (id, type, amount) => {
    setTransactions(transactions.filter(t => t.id !== id));
    if (type === 'expense') setBalance(prev => prev + amount); 
    if (type === 'income') setBalance(prev => prev - amount); 
  };

  // --- Splits ---
  const addSplit = (splitData) => {
    setSplits([{ ...splitData, id: Date.now() }, ...splits]);
    addTransaction({ 
      title: `Paid total for ${splitData.title}`, 
      type: 'expense', 
      amount: splitData.totalAmount, 
      date: 'Today' 
    });
  };

  const togglePaid = (splitId, personId) => {
    setSplits(splits.map(split => {
      if (split.id === splitId) {
        return {
          ...split,
          people: split.people.map(p => {
            if (p.id === personId) {
              if (!p.paid) {
                addTransaction({ title: `${p.name} paid back for ${split.title}`, type: 'income', amount: p.amount, date: 'Today' });
              } else {
                addTransaction({ title: `Reverted ${p.name}'s payment for ${split.title}`, type: 'expense', amount: p.amount, date: 'Today' });
              }
              return { ...p, paid: !p.paid };
            }
            return p;
          })
        };
      }
      return split;
    }));
  };

  const deleteSplit = (id) => {
    setSplits(splits.filter(s => s.id !== id));
  };

  // --- Savings ---
  const addGoal = (goalData) => {
    setGoals([{ ...goalData, id: Date.now(), current: 0 }, ...goals]);
  };

  const addMoneyToGoal = (goalId, amount) => {
    setGoals(goals.map(g => {
      if (g.id === goalId) {
        // Automatically deduct this money from the main dashboard balance!
        addTransaction({ title: `Transferred to savings: ${g.title}`, type: 'expense', amount: Number(amount), date: 'Today' });
        return { ...g, current: g.current + Number(amount) };
      }
      return g;
    }));
  };

  return (
    <GlobalContext.Provider value={{ 
      balance, transactions, addTransaction, deleteTransaction, 
      splits, addSplit, togglePaid, deleteSplit,
      goals, addGoal, addMoneyToGoal
    }}>
      {children}
    </GlobalContext.Provider>
  );
};
