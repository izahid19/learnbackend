## Auth API

post /signup
post /login
post /logout

## profile router

get /profile/view
patch /profile/update
post /profile/password //pending

## Connection request

POST - /request/send/interested/:userId
POST - /request/send/ignored/:userId
POST - /request/review/accepted/:userId
POST - /request/review/rejected/:userId


## user Router 

GET - /user/connection
GET - /user/request
GET - /user/feed


status : ignored, interested , accepted , rejected
