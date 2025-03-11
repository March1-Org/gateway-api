import Dockerode from "dockerode";

export const dockerode = new Dockerode({ host: "127.0.0.1", port: 2375 });
