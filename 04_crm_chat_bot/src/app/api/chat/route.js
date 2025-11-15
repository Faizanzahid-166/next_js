import axios from "axios"
const HUBSPOT_API = "https://api.hubapi.com"

export async function getCustomerByEmail(email) {
  const res = await axios.get(`${HUBSPOT_API}/crm/v3/objects/contacts/search`, {
    headers: { Authorization: `Bearer ${process.env.HUBSPOT_TOKEN}` },
    params: { q: email },
  })
  return res.data
}

export async function createTicket(subject, content) {
  const res = await axios.post(
    `${HUBSPOT_API}/crm/v3/objects/tickets`,
    {
      properties: {
        subject,
        content,
        hs_pipeline: "0",
        hs_pipeline_stage: "1",
      },
    },
    {
      headers: { Authorization: `Bearer ${process.env.HUBSPOT_TOKEN}` },
    }
  )
  return res.data
}
