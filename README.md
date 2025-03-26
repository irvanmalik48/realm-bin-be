# Realm Bin BE

Backend for Realm Bin Pastebin Clone.

## Features

- It's fast (yeah, no sh\*t sherlock).
- Pastes can be locked behind password.
- Configurable paste id length and other variables.
- Store file (default max size is 1MB).
- Automatic cleanups for expired file-based paste keys.

## Running on local

1. Clone this repo:

```bash
git clone https://github.com/irvanmalik48/realm-bin-be
```

2. Install dependencies:

You'll need to install `valkey` for the KV database. Do refer to their site on how to set it up.

This project uses `bun`. So please use `bun`. Any other attempts to use anything other than `bun` will require some rewriting because this project uses some `bun`'s native functions.

```bash
bun install
```

3. Running dev server:

```bash
bun run dev
```

## Deploying

1. Go clone the repo and install the dependencies like how you should when you want to run it in local.

2. Copy paste the `.env.example` file and rename it to `.env`. Fill the necessary field as per the example. You can also consult the `valkey` docs for some more options on how to structure the link to it.

3. In `config.ts` file, change the environment, domain (needed for CORS on prod), port where you wanna run it from, there's also other variables you can modify in general but keep notes on those 3 and probably also the folder path in that config. Using "production" for the environment is recommended if you want to have cleaner logs (it logs absolutely nothing doing so except for some essential stuffs).

4. Since it uses `/opt/pastes` by default for file-based pastes, do create the folder and give proper permissions:

```bash
sudo mkdir /opt/pastes
sudo chown your-user:your-user /opt/pastes
sudo chmod 700 /opt/pastes
```

5. Run the build command:

```bash
bun run build
```

6. Voila! You have the `server` executable now. I recommend you to set up a systemd service (or any kind of init service manager you have currently) and host it natively. Here's an example for systemd service:

```ini
[Unit]
Description=Realm Bin Backend Server
After=network.target

[Service]
Type=simple
User=your-user
WorkingDirectory=/path/to/realm-bin-be
ExecStart=/path/to/realm-bin-be/server
Restart=on-failure
RestartSec=5
StandardOutput=journal
StandardError=journal
TimeoutStopSec=2

[Install]
WantedBy=multi-user.target
```

## TODO

- [x] ~Proper documentation~ We got Swagger now.
- [x] Text-based paste.
- [x] File-based paste.
- [x] Passworded paste for both types of paste.
- [x] Size and length constraint for pastes.
- [ ] Encrypt paste if a password is set.
- [ ] More customization options.

## License

RCCL
