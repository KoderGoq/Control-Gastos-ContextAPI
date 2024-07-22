import { useReducer, createContext, Dispatch, ReactNode, useMemo } from 'react';
import { BudgetActions, BudgetState, budgetReducer, initialState } from '../reducers/budget-reducer';

type BudgetContextProps = {
  state: BudgetState
  dispatch: Dispatch<BudgetActions>
  totalExpenses: number
  remainingbudget: number
}

type BudgetProviderProps = {
  children: ReactNode
}

export const BudgetContext = createContext<BudgetContextProps>(null!);


export const BudgetProvider = ({ children }: BudgetProviderProps) => {

  const [state, dispatch] = useReducer(budgetReducer, initialState);

  const totalExpenses = useMemo(() => state.expenses.reduce((total, expenses) => expenses.amount + total, 0), [state.expenses]);
  const remainingbudget = state.budget - totalExpenses;

  return (
    <BudgetContext.Provider
      value={{
        state,
        dispatch,
        totalExpenses,
        remainingbudget
      }}
    >
      {children}
    </BudgetContext.Provider>
  )
}


export default BudgetContext
