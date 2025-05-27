import { createClient, } from "redis";
import { Engine } from "./trade/Engine";

function sleep(ms : number){
    return new Promise((resolve) => setTimeout(resolve,ms))
}
async function main() {
    const engine = new Engine();  // initialize a new instance of engine
    const redisClient = createClient();
    await redisClient.connect(); // connect the engine instance to redis using redisClient
    console.log("connected to redis");

    // Gracefull Shutdown
    // SIGINT Handling
    process.on("SIGINT", async () => {
        console.log("Shutting down ...")
        await redisClient.quit();
        process.exit(0)
    })
    // synchrounously process messages ..... Enter in an infinite loop- to keep processing messages
    while (true) {
        try {
            const response = await redisClient.rPop("messages" as string) // pop a message from the end of the Redis list
        // if there is no message, it skips(or could wait)
        // When response is null then loops runs immediately. This causes high CPU usage when the queue is empty.
        if (!response) {
            await sleep(100); // avoid busy waiting
        }  else {
            engine.process(JSON.parse(response)); // this is not asynchronous, there is no database operation/ database call
        }
        } catch (error) {
            console.log("Error processing message: ", error)
        }
                
    }

}
// there is no asynchronous task, since we are not putting data in the database
main();