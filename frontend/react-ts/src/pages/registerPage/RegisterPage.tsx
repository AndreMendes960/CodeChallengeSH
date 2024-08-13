import { useContext, useState } from "react"
import { useNavigate } from "react-router-dom"

import Input from "../../components/inputText/Input"
import Layout from "../../components/layouts/Layout"
import LoadingButton from "../../components/loadingButton/LoadingButton"
import AuthContext from "../../middleware/authContext"

import config from "../../config"

import styles from "./RegisterPage.module.scss"

const RegisterPage = () =>{

    const [email, setEmail] = useState("")
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")

    const navigate = useNavigate()

    const {register} = useContext(AuthContext)


    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        setLoading(true)
        try{
            await register(email, username, password)
            navigate("/login")
        }catch(error : any){
            setError(error.message)
            setLoading(false)
        }
    }

    return(
        <Layout>
            <div className={styles.mainDiv}>
                <p className={styles.titleDiv}>{config.app_name}</p>
                <p className={styles.pageTitleDiv}>Create an account</p>
                <form onSubmit={onSubmit}>
                    <div className={styles.inputDiv}>
                        <Input label="Email" defaultValue={email} onChangeFunction={setEmail}></Input>
                        <Input label="Username" defaultValue={username} onChangeFunction={setUsername}></Input>
                        <Input type="password" label="Password" defaultValue={password} onChangeFunction={setPassword}></Input>
                        <LoadingButton type="submit" label={"Login"} loading={loading}></LoadingButton> 
                    </div>
                </form>
                {error !== "" && <p style={{ color: 'red' }}>{error}</p>}
            </div>
        </Layout>
    )
}
export default RegisterPage