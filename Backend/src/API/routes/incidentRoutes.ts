import {Router} from 'express'
import { addIncident, deleteIncident, getIncident, getIncidents } from '../controllers/incidentControllers'
import { roleBasedToken } from '../middleware'

const incidentRouter = Router()

incidentRouter.post("/add-incident",addIncident)
incidentRouter.get("",getIncidents)
incidentRouter.get("/:id",getIncident)
incidentRouter.patch("/sensor-incident/:id",roleBasedToken)
incidentRouter.delete("/:id",roleBasedToken, deleteIncident)

export default incidentRouter