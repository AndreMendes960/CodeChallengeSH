import { useContext, useState } from "react"
import { useNavigate } from "react-router-dom"

import Input from "../components/input/Input"
import Layout from "../components/layouts/Layout"
import LoadingButton from "../components/loadingButton/LoadingButton"
import AuthContext from "../middleware/authContext"

import config from "../config"


import styles from "./LoginPage.module.scss"

const LoginPage = () =>{

    const [email, setEmail] = useState("")

    const [password, setPassword] = useState("")
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")

    const navigate = useNavigate()

    const {login} = useContext(AuthContext)

    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setLoading(true)
        try{
            await login(email, password).then(() => navigate("/"))
            
        }catch(error : any){
            setError(error.message)
            setLoading(false)
        }
    }

    return(
        <Layout>
            <div className={styles.mainDiv}>
                <p className={styles.titleDiv}>{config.app_name}</p>
                <form onSubmit={onSubmit}>
                    <div className={styles.inputDiv}>
                        <Input label="Email" defaultValue={email} onChangeFunction={setEmail}></Input>
                        <Input type="password" label="Password" defaultValue={password} onChangeFunction={setPassword}></Input>
                        <LoadingButton type="submit" label={"Login"} loading={loading}></LoadingButton> 
                    </div>
                </form>
                {error !== "" && <p style={{ color: 'red' }}>{error}</p>}

                <p>No account? Create one <a href="/register">Here</a></p>
            </div>
        </Layout>
    )
}
export default LoginPage