import React, {useEffect, useState} from "react";
import {AvField, AvForm} from 'availity-reactstrap-validation'
import {toast} from "react-toastify";
import {useRouter} from "next/router";
import {getCookie, setCookie} from "../tools";
import Loading from "../components/Loading";
import Title from "../components/Title";

export default function Home() {
    const [loading, setLoading]=useState(true)
    const [opacity, setOpacity]=useState(false)

    useEffect(() => {
        async function fetchData(){
            try {
                let token=localStorage.getItem("token")
                if(!token){
                    token=getCookie("token")
                }
                if (token) {
                    const req=await fetch(process.env.SERVER_URL+"auth/token/check",{
                        method: "GET",
                        headers: {
                            "Content-Type": "application/json",
                            "Authorization": "Bearer "+token
                        }
                    }).catch((e)=>{
                        toast.error("Something went wrong. Please, check your internet connection")
                    })
                    const data=await req.json()
                    if(data.success===true){
                        await router.push("/orders")
                    }
                }
            }catch (e) {
                localStorage.removeItem("token")
                console.log(e)
            }

        }
        fetchData().then(() => {
            setLoading(false)
            setOpacity(true)
        })

    }, [])

    const router = useRouter()

    const login = async (e, v) => {
        setOpacity(true)
        setLoading(true)
        const req = await fetch(process.env.SERVER_URL + "auth/token/get", {
            body: JSON.stringify({
                login: v.number,
                password: v.password
            }),
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            }
        }).catch(()=>{
            toast.error("Something went wrong. Please, check your internet connection")
        })
        const res = await req.json()
        if (req.status === 200) {
            localStorage.setItem("token", res.token)
            setCookie("token", res.token, 7200)
            toast.success("Success authenticated!")
            await router.push("/orders")
        } else {
            toast.error(res["message"] ? res.message : "Something went wrong")
        }
        setLoading(false)

    }

    return (
        <>
            <Title name="PDP fastfood"/>
            <Loading active={loading} opacity={opacity}/>
            <div className="login full-screen">
                <div className="container h-100" >
                    <div className="row align-items-center h-100">
                        <div className="col-3 ms-auto my-auto">
                            <h4>Tizimga xush kelibsiz!</h4>
                            <p>
                                Tizimga kirish uchun, login va parol orqali
                                autentifikatsiya jarayonidan o’ting
                            </p>
                            <AvForm onValidSubmit={login}>
                                <AvField type="text" label="Number"
                                         name="number" placeholder="e.x: +998901234567"
                                         validate={{
                                             required: {value: true, errorMessage: "Please enter your number"},
                                             pattern: {
                                                 value: "^\\+998[0-9]{9}$",
                                                 errorMessage: "Please enter valida number e.x: +998901234567"
                                             }
                                         }}
                                />
                                <AvField type="password" label="Password"
                                         name="password" placeholder="Password"
                                         validate={{
                                             required: {value: true, errorMessage: "Please enter your password"}
                                         }}
                                />
                                <button type='submit' disabled={loading} className="btn btn-secondary w-100">Tizimga kirish</button>
                            </AvForm>
                        </div>


                    </div>
                </div>
            </div>


        </>
    )
}
