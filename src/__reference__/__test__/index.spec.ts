import { place } from "../../util/__test__";
import { isNil } from "../../util/lodash";
import { combineReducers, createStore } from 'redux'

describe('reference-basic',  () => {
  // Constant
  const SHOW_ALL = 'SHOW_ALL' 
  const SHOW_COMPLETED = 'SHOW_COMPLETED' 
  const SHOW_ACTIVE = 'SHOW_ACTIVE'

  // Action
  const actionTypes = {
    ADD_TODO: 'ADD_TODO',
    TOOGLE_TODO: 'TOOGLE_TODO',
    SET_VISIBILITY_FILTER: 'SET_VISIBILITY_FILTER',
  }

  const { ADD_TODO, TOOGLE_TODO, SET_VISIBILITY_FILTER } = actionTypes

  function addToDo( text: string ) {
    return {
      type: ADD_TODO,
      text
    }
  }

  function toogleTodo( index: number ) {
    return { type: TOOGLE_TODO, index  }
  }

  function setVisibilityFilter( filter: any ) {
    return { type: SET_VISIBILITY_FILTER, filter }
  }


  // Reducers
  type Todo = {
    text: string,
    completed: boolean
  }
  type State = {
    visibilityFiler: string,
    todos: Todo[]
  }
  const initialState: State = {
    visibilityFiler: SHOW_ALL,
    todos: []
  }

  function visibilityFilter( state: string = SHOW_ALL, action: any ) {
    switch( action.type ) {
      case SET_VISIBILITY_FILTER:
        return action.filter
      default:
        return state
    }
  }


  function todos( state: Todo[] = [], action: any ): Todo[] {
    switch ( action.type ) {
      case ADD_TODO: 
        return [
          ...state,
          {
            text: action.text,
            completed: false
          }
        ]
      case TOOGLE_TODO:
        return state.map( ( todo, index ) => {
          if ( index === action.index ) {
            return {
              ...todo,
              completed: !todo.completed
            }
          }
        } )
      default:
        return state
    }
  }


  // // way 1
  function todoApp(state: any = {}, action: any) {
    return {
      visibilityFilter: visibilityFilter(state.visibilityFilter, action),
      todos: todos(state.todos, action)
    }
  }
  // // way2 
  const todoApp2 = combineReducers( {
    visibilityFilter,
    todos
  } )


  // Store
  const getStore = () => createStore( todoApp )  

  it( 'dispatchign actions', () => {
    const store = getStore()
    // Log the initial state
    const initialState = store.getState()
    place( initialState )

    const { dispatch } = store    
    dispatch( addToDo( 'task1' ) )
    dispatch( addToDo( 'task2' ) )

    // Log the updated state
    const updatedState = store.getState()
    place( updatedState )
  } )

  it( 'subscrib and unsubscribe', () => {
    const store = getStore()
    const { dispatch } = store
    
    // subscribe log event every time after the state changes
    // Note: `store.subscribe(...)` will returns a unsubscribe function
    const unsubscribe = store.subscribe( () => {
      if ( true ) {
        console.group( 'subscrib and unsubscribe' )
        console.log( store.getState() )
      }
    } )

    dispatch( addToDo( 'task1' ) )
    dispatch( addToDo( 'task2' ) )
  } )

})