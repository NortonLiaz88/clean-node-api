import request from 'supertest'
import app from '../config/app'

describe('CORS Middleware', () => {
  test('Should return content type as json', async () => {
    app.get('/test_content_type', (req, res) => {
      res.send()
    })
    await request(app).get('/test_content_type')
      .expect('content-type', /json/)
  })

  test('Should return content type XML when forced', async () => {
    app.get('/test_content_xml', (req, res) => {
      res.type('xml')
      res.send()
    })
    await request(app).get('/test_content_xml')
      .expect('content-type', /xml/)
  })
})
