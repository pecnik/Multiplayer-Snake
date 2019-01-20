import { GameClient } from "../game/GameClient";
import { getPlayerNameErrors } from "../game/Selectors";
import { debounce } from "lodash";

getPlayerName().then(startGame);

function getPlayerName() {
    return new Promise(resolve => {
        const $input = document.querySelector("#input") as HTMLInputElement;
        const $error = document.querySelector("#error") as HTMLElement;
        const $btn = document.querySelector("#login-btn") as HTMLButtonElement;
        if (!$error || !$input || !$btn) {
            throw new Error("Missing #login element");
        }

        const updateErrorMsg = debounce((error?: string | undefined) => {
            console.log({ error });
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
                console.log("TRY", error);
                $btn.disabled = true;
                updateErrorMsg(error);
                return;
            }

            console.log("OK", { name });
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

function startGame() {
    const $app = document.getElementById("app");
    if ($app === null) {
        throw new Error("Missing #app element");
    }

    GameClient($app);
}
