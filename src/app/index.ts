import { GameClient } from "../game/GameClient";
import { getPlayerNameErrors } from "../game/Selectors";
import { debounce } from "lodash";

getPlayerName().then(startGame);

function getPlayerName() {
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

            if ($form.parentNode) {
                $form.parentNode.removeChild($form);
                resolve($input.value);
            }
        };

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

function startGame(name: string) {
    const $app = document.getElementById("app");
    if ($app === null) {
        throw new Error("Missing #app element");
    }

    GameClient($app, name);
}
