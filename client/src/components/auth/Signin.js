import React, { Component } from "react";
import axios from "axios";
import { NavLink, Link } from "react-router-dom";
import firebase from "firebase";
import { observer } from "mobx-react-lite";
import { AuthStoreContext } from "../../stores/authStore";

import { signInWithGoogle } from "./firebase/SignInMethods";

import Mensagem from "../messages/Mensagem";

import "./style/signin.scss";

class Signin extends Component {
  state = {
    status: null,
    email: "",
    senha: "",
    erros: null
  };
  componentDidMount() {
    if (this.props.location.state) {
      this.setState({ status: this.props.location.state.status });
    }
  }
  onChange = e => {
    this.setState({ [e.target.name]: e.target.value });
  };
  SignInWithEmailFromMongo = e => {
    e.preventDefault();
    const { email, senha } = this.state;
    axios
      .post("/api/signin", {
        email,
        senha
      })
      .then(res => {
        if (res.data.erros) {
          this.setState({ erros: null });
          console.log(res.data.erros);
          this.setState({ erros: res.data.erros });
        } else {
          localStorage.setItem("token", res.data.token);
          localStorage.setItem("user", JSON.stringify(res.data.user));

          this.setState({ erros: null });
          return this.props.history.push({
            pathname: "/home",
            state: { status: 200 },
            from: this.props.location
          });
        }
      });
  };

  provider = new firebase.auth.GoogleAuthProvider();

  signInWithGoogle = async () => {
    firebase
      .auth()
      .signInWithPopup(this.provider)
      .then(res => {
        localStorage.setItem("user", JSON.stringify(res.user));
        document.cookie = "hasUser = true";
        return this.props.history.push({
          pathname: "/home",
          state: { status: 200 },
          from: this.props.location
        });
      })
      .catch(e => console.log(e));
    const user = await firebase.auth().currentUser;
    user ? console.log('user: ' + user) : console.log('nada aqui...')
  };

  render() {
    const { status, erros } = this.state;
    //console.log(this.state.status);
    return (
      <div className="container">
        <div className="row">
          <div className="col-md-4 offset-md-4">
            <form onSubmit={e => this.SignInWithEmailFromMongo(e)}>
              <h4 className="my-3">Entrar</h4>
              {erros
                ? erros.map(erro => (
                  <Mensagem key={erro.msg} msg={erro.msg} type={"erro"} />
                ))
                : null}
              {status === 200 ? (
                <Mensagem
                  msg="Você foi cadastrado com sucesso!"
                  type="sucesso"
                />
              ) : null}
              <div className="form-group">
                <input
                  onChange={e => this.onChange(e)}
                  name="email"
                  type="email"
                  className="form-control"
                  placeholder="Email"
                />
              </div>
              <div className="form-group">
                <input
                  onChange={e => this.onChange(e)}
                  name="senha"
                  type="password"
                  className="form-control"
                  placeholder="Senha"
                />
              </div>
              <div className="form-group">
                <button className="btn btn-primary btn-block">Sign in</button>
              </div>
              <div className="d-flex justify-content-center ">
                <div className="m-2">
                  <div
                    onClick={() => this.signInWithGoogle()}
                    href="#"
                    className="fa fa-google"
                  />
                </div>
                <div className="m-2">
                  <a href="#" className="fa fa-facebook" />
                </div>
                <div className="m-2">
                  <a href="#" className="fa fa-twitter" />
                </div>
              </div>
              <h4 className="mt-4 mb-3">Não é cadastrado?</h4>
              <div className="form-group">
                <NavLink to="/signup" className="btn btn-danger btn-block">
                  Sign up
                </NavLink>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }
}

export default Signin;
