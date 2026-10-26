import axios from 'axios'

const talentIQApi = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  timeout: 120000,
})

export default talentIQApi
