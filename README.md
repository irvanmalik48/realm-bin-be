# Realm Bin BE

Backend for Realm Bin Pastebin Clone.

## Features

- It's fast (yeah, no sh\*t sherlock).
- Pastes can be locked behind password.
- Configurable paste id length.

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

Deploying this is pretty easy. Yeah, that's it, what are you expecting me to say after?

1. Clone thi- why do I even rewrite this in the first place. Go clone the repo and install the dependencies like how you should when you want to run it in local.

2. Copy paste the `.env.example` file and rename it to `.env`. Fill the necessary field as per the example. You can also consult the `valkey` docs if you want to. Not that I care, to be honest.

3. In `config.ts` file, change the environment and port where you wanna run it from. Using "production" for the environment is recommended if you want to have cleaner logs (it logs absolutely nothing doing so).

4. Run the build command:

```bash
bun run build
```

5. Voila! You have the `server` executable now. Do whatever you want with it, I don't care. But I recommend you to set up a systemd service (or any kind of init service manager you have currently) and host it natively. Here's an example for systemd service:

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

[Install]
WantedBy=multi-user.target
```

## License

RCCL
