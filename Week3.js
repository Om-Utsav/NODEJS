///Refactor an existing piece of code that uses callbacks for async operations to use Promises and Async/Await for better readability and error handling.
//All cases include both scenarios, i.e. when the program take happy path and runs as required, and also when there is an error.

//CALLBACK VERSION
const callbackFn = (firstName, callback) => {
    setTimeout(() => {
        if (!firstName) return callback(new Error('no first name passed in'))

        const fullName = `${firstName} Doe`

        return callback(fullName)
    }, 2000)
}

callbackFn('John', console.log)
callbackFn(null, console.log)

//PROMISE VERSION
const promiseFn = firstName => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            if (!firstName) reject(new Error('no first name passed in!'))

            const fullName = `${firstName} Doe`

            resolve(fullName)
        }, 2000)
    })
}

promiseFn('Jane').then(console.log)
promiseFn().catch(console.log)

//Async Await function used for executing promise version
const result = (async () => {
    try{
        console.log(await promiseFn('Jim'))
    } catch (e) {
        console.log(e)
    }

    try {
        console.log(await promiseFn())
    } catch (e) {
        console.log(e)
    }
}) ()

//ASYNC AWAIT VERSION
const timeout = ms => {
    return new Promise(resolve => setTimeout(resolve, ms))
}

const asyncAwaitFn = async firstName => {
    await timeout(2000)

    if (!firstName) throw new Error('no first name passed in!')

    const fullName = `${firstName} Doe`

    return fullName
}

const res = (async () => {
    try {
        console.log(await asyncAwaitFn('Jack'))
    } catch (e) {
        console.log(e)
    }

    try {
        console.log(await asyncAwaitFn())
    } catch (e) {
        console.log(e)
    }
}) ()
