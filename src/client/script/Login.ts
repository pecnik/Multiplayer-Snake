import SocketIOClient from "socket.io-client";
import { getPlayerNameErrors } from "../../snake/Selectors";
import { Keys } from "../../snake/data/Keys";

export function login(): Promise<SocketIOClient.Socket> {
    return new Promise(resolve => {
        const dispose = new Array<Function>();
        const socket = SocketIOClient.connect(
            location.href.replace(location.port, "8080"),
            { reconnection: false }
        );

        const $loginForm = document.querySelector("#login") as HTMLElement;
        const $error = document.querySelector("#error") as HTMLElement;
        const $input = document.querySelector("#input") as HTMLInputElement;
        const $btn = document.querySelector("#login-btn") as HTMLButtonElement;

        socket.once("login-success", () => {
            destroyForm();
            resolve(socket);
        });

        useEffect(() => {
            socket.on("login-error", showErrorMsg);
            return () => {
                socket.off("login-error", showErrorMsg);
            };
        });

        useEffect(() => {
            $btn.addEventListener("click", attemptLogin, false);
            return () => {
                $btn.removeEventListener("click", attemptLogin, false);
            };
        });

        useEffect(() => {
            const onKeydown = (ev: KeyboardEvent) => {
                if (ev.keyCode === Keys.ENTER) {
                    attemptLogin();
                }
            };

            $input.addEventListener("keydown", onKeydown, false);
            return () => {
                $input.removeEventListener("keydown", onKeydown, false);
            };
        });

        function useEffect(effect: () => Function | void) {
            const cleanup = effect();
            if (cleanup !== undefined) {
                dispose.push(cleanup);
            }
        }

        function attemptLogin() {
            const name = $input.value;
            const error = getPlayerNameErrors($input.value);
            if (error === undefined) {
                socket.emit("login", name);
            } else {
                showErrorMsg(error);
            }
        }

        function showErrorMsg(msg: string) {
            $error.innerHTML = msg;
            if ($error.style.display !== "block") {
                $error.style.display = "block";
            } else {
                $error.classList.remove("shake");
                setTimeout(() => $error.classList.add("shake"));
            }
        }

        function destroyForm() {
            dispose.forEach(cleanup => cleanup());
            if ($loginForm.parentElement) {
                $loginForm.parentElement.removeChild($loginForm);
            }
        }
    });
}
