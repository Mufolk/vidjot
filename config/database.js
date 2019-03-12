if(process.env.NODE_ENV === 'production'){
    module.exports = { mongoURI:
        'mongodb://mufolk:mufolk138@ds141043.mlab.com:41043/vidjot138-prod'
    }
} else {
    module.exports = { mongoURI : 'mongodb://localhost:27017/vidjot-dev'
    }
}