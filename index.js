import React, { Component } from 'react'
import PropTypes from 'prop-types'
import ReactDOM from 'react-dom'
import { createStore,bindActionCreators } from 'redux'
import { Provider, connect } from 'react-redux'

// React component  容器组件
class Counter extends Component {
  render() {
	const  {value ,onAddAction,onCompleteAction,onDeleteAction} = this.props
	const divStyle = {
		float:'center',
		margin:'10px',
		width:'40%',
		height:'100%',
		margin: '0 auto',
		backgroundColor:'#ffff99'
	}
    return (
      <div style={divStyle}>
      	<Header />
        <NewTodo onAddAction={onAddAction}/>
       	<List  onCompleteAction={onCompleteAction} deleteAction={onDeleteAction} todos={this.props.value.list}/>
      </div>
    )
  }
}

//标题
class Header extends Component {
	render() {

		return(
			<div style={{textAlign:'center'}}>
			<h1>Todo List</h1>
			</div>
			)
	}
}
//填加一个新事项
class NewTodo extends Component {

	render() {
	const divStyle = {
		textAlign:'center',
		margin: '0 auto',

	}
	const inputStyle = {
		width: '60%',
		textAlign:'left'
	}	
		return(
		<div className="form-group" style={divStyle}>
		<form className="form-inline"onSubmit={(e) =>this.handleAdd(e)}>
		<input className="form-control" style={inputStyle} type="text" ref="inputnew" id="todo-new" placeholder="添加一个待办事项"  autoComplete="off"/>
		<button className="btn btn-default" type="submit">Add</button>
		</form>
		</div>
		);
	}
		handleAdd(e) {
			e.preventDefault();
			const inputDom = this.refs.inputnew;
			const newTodo = inputDom.value.trim();
			if (newTodo!=='') {
				this.props.onAddAction(newTodo);
				inputDom.value="";
			}
		}

}
//事项列表
class List extends Component{

	render(){
	const divStyle = {
		textAlign:'center',
		margin: '0 auto',
		width: '100%'

	}
	const ulstyle= {
		textAlign:'left'
	}
	return(
			<div style={divStyle}>
			<ul style={ulstyle} >	
	{
	this.props.todos.map((item,index)=>
			<Todo onClick={()=>this.props.onCompleteAction(index)} buttonClick={()=>this.props.deleteAction(index)} todo={item}  key={index} lkey={index}  />
		)
	}
			</ul>
			</div>
		)	
	}
}

// todo
class Todo extends Component{
	// const  {onCompleteAction} = this.props

	render(){
		const checkboxStyle = {
			width:'20px',
			height:'20px',
			margin: '5px 10px ',
			cursor:  'pointer',
			float:'left'
		}

		const liStyle={
			textDecoration: this.props.todo.completed ?'line-through':'none',
			width:'100%',
			fontSize: '20px',
			listStyle:'none',
			margin:'10px'
		}
		const spanStyle={
			spanStyle:'none'
		}
		const buttonStyle={
			float:'right',
			cursor:  'pointer'
		}
		return 			(
			<li onMouseOver={this.handleOnMouse} style={liStyle}>

	            <input style={checkboxStyle} onClick={this.props.onClick}  type="checkbox" />
				<span style={spanStyle}>{this.props.todo.text}</span>
				<button style={buttonStyle} className="btn btn-default" onClick={this.props.buttonClick} >delete</button>
				
			</li>
			)
			
	}
	handleOnMouse(){
		const buttonStyle={
			float:'right',
			cursor: 'pointer',
			opacity:'0'
		}
		
	}

}

//action
const actions = {
  onAddAction: (text) => ({type: 'ADD_TODO',text}),
  onCompleteAction: (index) => ({type: 'COMPLETE_TODO',index}),
  deleteAction: (index) => ({type: 'DELETE_TODO',index})
}

//Reducer
function todos(state = { list:[] }, action) {

	switch (action.type) {
		case 'ADD_TODO':
		      return Object.assign({}, state, {
		        list: [
		          ...state.list,
		          {
		            text: action.text,
		            completed: false
		          }
		        ]
		      })

		case 'COMPLETE_TODO':
		return 	Object.assign({}, state, {
				list: state.list.map(function(todo,index){
					if (index==action.index) {
						return Object.assign({},todo,{
						completed: !todo.completed	
						})	
					}
					return todo
				})
            })

        case 'DELETE_TODO':
        console.log(action.index);
        return 	Object.assign({}, state, {
          list: [...state.list.slice(0,action.index),...state.list.slice(action.index+1)]
        })
        
		default:
			return state

	}
}

// Store
const store = createStore(todos)
// Map Redux state to component props
function mapStateToProps(state) {
  return {
    value: state
  }
}
//Map Redux actions to component props
function mapDispatchToProps(dispatch) {
  return bindActionCreators({ 
    onAddAction: actions.onAddAction,
    onCompleteAction: actions.onCompleteAction,
    onDeleteAction: actions.deleteAction
  },dispatch);
}
// Connected Component
const App = connect(
  mapStateToProps,
  mapDispatchToProps
)(Counter)
ReactDOM.render(
	  <Provider store={store}>
	    <App />
	  </Provider>,
	  document.getElementById('root')
	)