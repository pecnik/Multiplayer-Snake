import SocketIOClient from "socket.io-client";
import { GameClient } from "../snake/GameClient";
import { getPlayerNameErrors } from "../snake/Selectors";
import { debounce } from "lodash";

const socket = SocketIOClient.connect(
    location.href.replace(location.port, "8080"),
    { reconnection: false }
);

login().then(startGame);

function login() {
    return new Promise(resolve => {
        const $form = document.querySelector("#login") as HTMLElement;
        const $input = document.querySelector("#input") as HTMLInputElement;
        const $error = document.querySelector("#error") as HTMLElement;
        const $btn = document.querySelector("#login-btn") as HTMLButtonElement;
        if (!$form || !$error || !$input || !$btn) {
            throw new Error("Missing #login element");
        }

        const updateErrorMsg = debounce((error?: string | undefined) => {
            if (error !== undefined) {
                $error.style.display = "block";
                $error.innerHTML = error;
            } else {
                $error.style.display = "none";
            }
        }, 100);

        const tryLogin = () => {
            const name = $input.value;
            const error = getPlayerNameErrors(name);
            if (error) {
                $btn.disabled = true;
                updateErrorMsg(error);
                return;
            }

            socket.emit("login", name);
        };

        $input.value = localStorage.getItem("player-name") || "";
        $input.click();
        $btn.disabled = getPlayerNameErrors($input.value) !== undefined;
        updateErrorMsg();

        socket.on("login-success", () => {
            if ($form.parentNode) {
                $form.parentNode.removeChild($form);
                localStorage.setItem("player-name", $input.value);
                resolve($input.value);
            }
        });

        socket.on("login-error", (error: string) => {
            updateErrorMsg(error);
        });

        $btn.addEventListener("click", tryLogin);

        $input.addEventListener(
            "keydown",
            debounce(ev => {
                if (ev.keyCode === 13) {
                    tryLogin();
                    return;
                }

                const value = $input.value || "";
                const error = getPlayerNameErrors($input.value);
                $btn.disabled = error !== undefined;

                if (value.length >= 3 && error) {
                    updateErrorMsg(error);
                } else {
                    updateErrorMsg();
                }
            })
        );
    });
}

function startGame() {
    const $el = document.getElementById("app");
    if ($el === null) {
        throw new Error("Missing #app element");
    }

    GameClient({ $el, socket });
}
