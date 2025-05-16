const Connect = require("bridgenode");
const { ConnectReq, SubscribeReq, UnSubscribeReq, MWBOCombined, Index, LowerCircuitData } = require("./poc_models");

async function main() {
  try {
    /** @type {Connect} */
    const c1 = Connect.getInstance();

    //Subscribe Events
    
    // c1.on("OnFeedDataReceived", (byteArray, topic) => {
    //     const parsedData = new MWBOCombined(byteArray);
    //     console.log(`${topic}:`, parsedData);
    // });
    let messageCount = 0;
    c1.on("OnFeedDataReceived", (byteArray, topic) => {
        messageCount++;
    });

    c1.on('OnIndexDataReceived', (byteArray, topic) => {
        const parsedData = new Index(byteArray);
        console.log(`${topic}:`, parsedData);
    });

    c1.on("OnLowerCircuitDataReceived", (byteArray, topic) => {
        const parsedData = new LowerCircuitData(byteArray);
        console.log(`${topic}:`, parsedData);
    });

    c1.on("OnError", (errorCode, errorMsg) => {
        console.log(`${errorCode}:`, errorMsg);
    });

    //Events End

    const conn = await c1
      .connectHost(
        JSON.stringify(
          new ConnectReq(
            "eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICIxVks4TEhlRnRvSmp6YWk1RmJlSGNPbDI3ekpGanBScTE2Vmt4eGJBZ0ZjIn0.eyJleHAiOjE3NjE5OTU1NjUsImlhdCI6MTc0NjQ0MzU2NSwianRpIjoiM2I4ODQ4MzQtM2RiMy00NjZhLTkwMjktMjdmZDE1MjRiNDQwIiwiaXNzIjoiaHR0cHM6Ly9rZXljbG9hay5paWZsc2VjdXJpdGllcy5jb20vcmVhbG1zL0lJRkwiLCJhdWQiOiJhY2NvdW50Iiwic3ViIjoiODYwYWMzYzMtOTY1Ny00Y2VmLThkMGQtMjk0OGQ1YmUwNzNhIiwidHlwIjoiQmVhcmVyIiwiYXpwIjoiSUlGTCIsInNpZCI6IjRmMmQ4N2QzLTc3NjUtNDBmMy04YTA4LTQwYjVhMDc0NGM0OCIsImFjciI6IjEiLCJhbGxvd2VkLW9yaWdpbnMiOlsiaHR0cDovLzEwLjEyNS42OC4xNDQ6ODA4MC8iXSwicmVhbG1fYWNjZXNzIjp7InJvbGVzIjpbImRlZmF1bHQtcm9sZXMtaWlmbCIsIm9mZmxpbmVfYWNjZXNzIiwidW1hX2F1dGhvcml6YXRpb24iXX0sInJlc291cmNlX2FjY2VzcyI6eyJJSUZMIjp7InJvbGVzIjpbIkdVRVNUX1VTRVIiLCJBQ1RJVkVfVVNFUiJdfSwiYWNjb3VudCI6eyJyb2xlcyI6WyJtYW5hZ2UtYWNjb3VudCIsIm1hbmFnZS1hY2NvdW50LWxpbmtzIiwidmlldy1wcm9maWxlIl19fSwic2NvcGUiOiJvcGVuaWQgZW1haWwgcHJvZmlsZSIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJvbXMiOiJPTlQxIiwidWNjIjoiODM0NzQzNTUiLCJzb2xhY2VfZ3JvdXAiOiJTVUJTQ1JJQkVSX0NMSUVOVCIsIm5hbWUiOiJESVBFU0ggQU5BTlQgQkhBTEVLQVIgTkEiLCJwcmVmZXJyZWRfdXNlcm5hbWUiOiI4MzQ3NDM1NSIsImdpdmVuX25hbWUiOiJESVBFU0ggQU5BTlQgQkhBTEVLQVIiLCJmYW1pbHlfbmFtZSI6Ik5BIiwiZW1haWwiOiJiaGFsZWthci5kaXBlc2gxNDlAZ21haWwuY29tIn0.Oh4or2UvV3yTppxM3pKGimbMWVrnrwgb93ax1BpxFJTGV8R-19LzQiSSFLmhMvWCfnTBHFtwKJyZy-OsJ_SEy-k_MBRnTW6kUQVi9puU-wFCpprE9gn27kEQAIGV8ZQQe0bg65wX16AP6b8T6scfpaJM_izuRA-aZYSEhKnbxzZj0PamG7-rE0vl4mL1wFeGh6RNcP8ruAw3reafQgRLMS4WDAb2gmKwYRJCYLEezxStMVPZ9NXx_-oAqAblTX3gyK6yG0Bn0wCAThtcvbdYxw0VRP7xMqOS1w_l6BoqbZtRaxgRofT1R-hDj5Xjw5qJdq4wIvkX9erQVe4-2UM1Fg",
            "mqtts://sandesh.indiainfoline.com",  //ssl://bridge.iiflcapital.com, wss://bridge.iiflcapital.com, mqtts://sandesh.indiainfoline.com
            9906
          )
        ),
        (res) => {
          console.log("Disconnection Event:", res); // Logs connection & disconnection events
        }
      )
      .catch((err) => console.error("Connection Failed:", err));
    //   .then((res) => console.log("Connected:", res))
      
    if (JSON.parse(conn)?.message === "Success") {
      console.log("Connected:", conn)
        const Subreq = JSON.stringify(
            new SubscribeReq(["nsefo/35001","nsee/25"])
          );
        const Subreq1 = JSON.stringify(
            new SubscribeReq(["nseeq/999920010"])
          );

        c1.SubscribeFeed(Subreq)
          .then(response => {
              console.log("Subscription Success:", response);
          })
          .catch(error => {
              console.error("Subscription Failed:", error);
          });
    }
    

    const UnSubreq = JSON.stringify(
      new UnSubscribeReq(["nseeq/25", "nseeq/2885"])
    );

    c1.UnSubscribeFeed(UnSubreq)
    .then(response => {
      console.log("Unsub Success: ", response);
    })
    .catch(error => {
      console.error("Unsub Failed:", error);
    });

    setInterval(() => {
        console.log(`Messages per second: ${messageCount}`);
        messageCount = 0; // Reset count every second
    }, 1000);

    setInterval(() => {
        console.log("Connection Status:", c1.isConnected ? "Connected" : "Disconnected");
    }, 3000);

    setInterval(() => {
        c1.DisconnectHost()
        .then((res) => console.log("Diconnected:", res))
        .catch((err) => console.error("Diconnection Failed:", err));
    }, 10000);

  } catch (error) {
    console.error("Error:", error);
  }
}

main();
