import express, {json} from 'express'
import authRouter from '../API/routes/authRoutes'
import viewRouter from '../API/routes/viewRoutes'
import incidentRouter from '../API/routes/incidentRoutes'
import pollRouter from '../API/routes/pollRoutes'
import voteRouter from '../API/routes/voteRoutes'

const app = express()

app.use(json())
app.use("/auth", authRouter)
app.use("/views", viewRouter)
app.use("/incidents", incidentRouter)
app.use("/polls", pollRouter)
app.use("/votes",voteRouter)
app.listen(4000,()=>{
    console.log('Server is running...')
})