import React , {Component}from 'react';

class Register extends Component {
	constructor(props){
		super(props);
		this.state = {
			registerName : '',
			registerPassword : '',
			registerEmail : ''
		}
	}

	onRegisterNameChange = (event) => {
		this.setState({registerName : event.target.value});
	}

	onRegisterPasswordChange = (event) => {
		this.setState({registerPassword : event.target.value});
	}

	onRegisterEmailChange = (event) => {
		this.setState({registerEmail : event.target.value});
	}

	onSubmitRegister = () => {
		fetch('https://agile-waters-59493.herokuapp.com/register', {
			method : 'post',
			headers : {'Content-Type' : 'application/json'},
			body : JSON.stringify({
				name : this.state.registerName,
				email : this.state.registerEmail,
				password : this.state.registerPassword
			})
		})
			.then(response => response.json())
			.then(user => {
				if(user.id){
					this.props.loadUser(user);
					this.props.onRouteChange('Home');
				}
			})
	}

	render(){
		return (
			<article className="br3 ba dark-gray b--black-10 mv4 w-100 w-50-m w-25-l mw6 shadow-5 center">
				<main className="pa4 black-80">
				  <div className="measure">
				    <fieldset id="sign_up" className="ba b--transparent ph0 mh0">
				      <legend className="f1 fw6 ph0 mh0">Register</legend>
				      <div className="mt3">
				        <label className="db fw6 lh-copy f6" htmlFor="name">Name</label>
				        <input 
				        	className="pa2 input-reset ba bg-transparent hover-bg-black hover-white w-100" 
				        	type="text" 
				        	name="name"  
				        	id="name" 
				        	onChange = {this.onRegisterNameChange}/>
				      </div>
				      <div className="mt3">
				        <label className="db fw6 lh-copy f6" htmlFor="email-address">Email</label>
				        <input 
				        	className="pa2 input-reset ba bg-transparent hover-bg-black hover-white w-100" 
				        	type="email" 
				        	name="email-address"  
				        	id="email-address" 
				        	onChange = {this.onRegisterEmailChange} />
				      </div>
				      <div className="mv3">
				        <label className="db fw6 lh-copy f6" htmlFor="password">Password</label>
				        <input 
				        	className="b pa2 input-reset ba bg-transparent hover-bg-black hover-white w-100" 
				        	type="password" 
				        	name="password"  
				        	id="password" 
				        	onChange = {this.onRegisterPasswordChange}/>
				      </div>
				    </fieldset>
				    <div className="">
				      <input 
					      className="b ph3 pv2 input-reset ba b--black bg-transparent grow pointer f6 dib" 
					      type="submit" 
					      value="Register" 
					      onClick = {this.onSubmitRegister} />
				    </div>
				  </div>
				</main>
			</article>
		);
	}

}


export default Register;