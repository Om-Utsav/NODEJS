const http = require('http')
const fs = require('fs')
const port = 3000
const path = require('path')


try{
    fs.writeFileSync('index.html', 'Hi, my name is Om, and I am loving it here at Celebal.');
    console.log("File written successfully");
} catch(e) {
    console.log(e);
}

try {
   const result = fs.readFileSync('index.html', 'utf8')
   console.log(result)
} catch(e) {
    console.log(e);
}

const server = http.createServer(function(req, res) {
    res.writeHead(200, {'Content-Type': 'text/html' })
    fs.readFile('index.html', function(error, data) {
        if (error) {
            res.writeHead(404)
            res.write('Error: File Not Found')
        } else {
            res.write(data)
        }
        res.end()
    })
})

server.listen(port, function(error) {
    if (error) {
        console.log('Something went wrong', error)
    } else {
        console.log('Server is listening on port ' + port)
    }
})

const filePath = 'index.html'; 
const parsedPath = path.parse(filePath);
console.log(parsedPath);


// Uncomment this section to delete the file

/*fs.unlink(filePath, (err) => {
  if (err) {
    if (err.code === 'ENOENT') {
      console.error('Error: File not found');
    } else {
      console.error('Error deleting file:', err.message);
    }
  } else {
    console.log('File deleted successfully');
  }
});
