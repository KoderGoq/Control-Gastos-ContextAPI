import { useState, ChangeEvent, FormEvent, useEffect } from 'react';
import type { DraftExpense, Value } from '../types';
import { categories } from '../data/categories';
import DatePicker from 'react-date-picker';
import 'react-calendar/dist/Calendar.css';
import 'react-date-picker/dist/DatePicker.css';
import ErrorMessage from './ErrorMessage';
import { useBudget } from '../hooks/useBudget';


const ExpenseForm = () => {



  const [expense, setExpense] = useState<DraftExpense>({
    amount: 0,
    expenseName: '',
    category: '',
    date: new Date()
  })

  const [error, setError] = useState('');
  const [previousAmount, setPreviousAmount] = useState(0);

  const { dispatch, state, remainingbudget } = useBudget();

  useEffect(() => {
    if (state.editingId) {
      const editingExpense = state.expenses.filter((currentExpense) => currentExpense.id === state.editingId)[0];
      setExpense(editingExpense);
      setPreviousAmount(editingExpense.amount)
    }
  }, [state.editingId])

  const handleChange = (e: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    const isAmountField = ['amount'].includes(name);
    setExpense({
      ...expense,
      [name]: isAmountField ? +value : value
    })

  }

  const handleChangeDate = (value: Value) => {
    setExpense({
      ...expense,
      date: value
    })

  }

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Validar
    if (Object.values(expense).includes('')) {
      setError('Todos los campos son obligatorios')
      return;
    }

    // Validar que no sobrepase el limite
    if ((expense.amount - previousAmount) > remainingbudget) {
      setError('Ese gasto es mayor al presupuesto')
      return;
    }

    // Agregar o actualizar nuevo gasto
    if (state.editingId) {
      dispatch({ type: 'update-expense', payload: { expense: { id: state.editingId, ...expense } } })
    } else {
      dispatch({ type: 'add-expense', payload: { expense } })
    }


    // Reiniciar el state
    setExpense({
      amount: 0,
      expenseName: '',
      category: '',
      date: new Date()
    })
    setPreviousAmount(0);
  }

  return (
    <form action="" className='space-y-5' onSubmit={handleSubmit}>
      <legend className='uppercase text-center text-2xl font-black border-blue-500 border-b-4 py-2'>
        {state.editingId ? 'Actualizar gasto' : 'Nuevo gasto'}
      </legend>

      {error && <ErrorMessage> {error} </ErrorMessage>}

      <div className='flex flex-col gap-2'>
        <label htmlFor="expenseName" className='text-xl'>Name of Expense:</label>
        <input
          value={expense.expenseName}
          type="text"
          id='expenseName'
          placeholder='Add your expense'
          className='bg-slate-100 p-2'
          name='expenseName'
          onChange={handleChange}
        />
      </div>

      <div className='flex flex-col gap-2'>
        <label htmlFor="amount" className='text-xl'>Amount:</label>
        <input
          value={expense.amount}
          type="number"
          id='amount'
          placeholder='Add the amount of the expense: ex. 300'
          className='bg-slate-100 p-2'
          name='amount'
          onChange={handleChange}
        />
      </div>

      <div className='flex flex-col gap-2'>
        <label htmlFor="category" className='text-xl'>Category:</label>
        <select
          value={expense.category}
          id='category'
          className='bg-slate-100 p-2'
          name='category'
          onChange={handleChange}
        >
          <option value="">-- Select -- </option>
          {categories.map(category => (
            <option key={category.id} value={category.id}>{category.name}</option>
          ))}
        </select>
      </div>

      <div className='flex flex-col gap-2'>
        <label htmlFor="expenseName" className='text-xl'>Date of Expense:</label>
        <DatePicker
          className='bg-slate-100 p-2 border-0'
          value={expense.date}
          onChange={handleChangeDate}
        />
      </div>

      <input
        type="submit"
        className='bg-blue-600 cursor-pointer w-full p-2 text-white uppercase font-bold rounded-lg'
        value={state.editingId ? 'Update Expense' : 'Record Expense'}
      />
    </form>
  )
}

export default ExpenseForm