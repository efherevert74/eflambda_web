/* eslint-disable no-undef */
const MAX_REDUCTION_DEPTH = 128;

let lambda_terms = document.getElementById("lambda-terms");
let lambda_inp = document.getElementById("lambda-inp");
let var_lib_panel = document.getElementById("var-lib-panel");
let popup = document.getElementById("popup");

let lazy_check = document.getElementById("lazy");
let intermediate_check = document.getElementById("intermediate");

let lazy = lazy_check.checked;
let intermediate = intermediate_check.checked;

let currTerm = undefined;
const parseInp = () => {
    let inp = lambda_inp.value.replaceAll("λ", "\\");
    let term = c_term_parse(inp);
    return term;
};
const reInputTerm = () => {
    if (currTerm !== undefined) {
        c_term_free(currTerm);
    }
    currTerm = parseInp();
};
const getTerm = () => {
    if (currTerm === undefined) {
        currTerm = parseInp();
    }
    return currTerm;
};
const addTerm = (term_str) => {
    let termText = document.createTextNode(term_str);
    let newTerm = document.createElement("div");
    newTerm.classList += "term";
    newTerm.appendChild(termText);
    lambda_terms.appendChild(newTerm);

    return newTerm;
};
const clearTerms = () => {
    while (lambda_terms.lastChild) {
        lambda_terms.removeChild(lambda_terms.lastChild);
    }
    reInputTerm();
    // wait a little for browser to react to deletion before scrolling
    setTimeout(
        () => window.scrollTo({ top: 0, left: 0, behavior: "smooth" }),
        30,
    );
};
const reduce = (scroll = true) => {
    let term = getTerm();

    let termNode = addTerm(c_term_display(term));
    if (scroll) {
        termNode.scrollIntoView({ behavior: "smooth" });
    }

    c_term_reduce(term, lazy);
};

const reduceFull = () => {
    let term = getTerm();
    let depth = 0;
    if (intermediate) {
        do {
            if (depth++ > MAX_REDUCTION_DEPTH) {
                showPopup("Maximum reduction depth reached.");
                break;
            }
            addTerm(c_term_display(term));
        } while (c_term_reduce(term, lazy));
    } else {
        addTerm(c_term_display(term));
        while (c_term_reduce(term, lazy)) {
            /* empty */
        }
        addTerm(c_term_display(term));
    }
    lambda_terms.lastChild.scrollIntoView({ behavior: "smooth" });
};

const showPopup = (message) => {
    popup.innerText = message;
    popup.classList.remove("hidden");
    setTimeout(() => {
        popup.classList.add("hidden");
    }, 3000);
};

lazy_check.onchange = () => {
    lazy = lazy_check.checked;
};
intermediate_check.onchange = () => {
    intermediate = intermediate_check.checked;
};

const update_var_lib_panel = () => {
    let var_lib = c_var_lib_get();

    var_lib_panel.innerHTML = "";
    for (const [key, value] of Object.entries(var_lib)) {
        let var_div = document.createElement("div");
        var_div.classList.add("var-lib-item");

        let key_span = document.createElement("span");
        key_span.classList.add("var-lib-key");
        key_span.innerText = key;

        let value_span = document.createElement("span");
        value_span.classList.add("var-lib-value");
        value_span.innerText = " = " + value;

        var_div.appendChild(key_span);
        var_div.appendChild(value_span);
        var_lib_panel.appendChild(var_div);
    }
};

lambda_inp.oninput = () => {
    clearTerms();
    reduce(false);
    update_var_lib_panel();
};

Promise.all([
    new Promise((resolve) => {
        document.addEventListener("DOMContentLoaded", resolve, { once: true });
    }),
    new Promise((resolve) => {
        document.addEventListener("WASMReady", resolve, { once: true });
    }),
]).then(() => {
    if (lambda_inp.value === "") {
        lambda_inp.value = "Fact 10";
        lambda_inp.oninput();
    }
    update_var_lib_panel();
});

document.addEventListener("keydown", (event) => {
    if (event.code === "Escape") {
        if (document.activeElement === lambda_inp) {
            lambda_inp.blur();
        }
    }
    if (event.code === "Enter") {
        if (event.shiftKey) {
            event.preventDefault();
            reduceFull();
            return;
        }
        event.preventDefault();
        reduce();
        return;
    }

    if (document.activeElement !== document.body) {
        return;
    }

    switch (event.key) {
        case "i": {
            intermediate_check.checked = !intermediate_check.checked;
            intermediate_check.onchange();
            break;
        }
        case "l": {
            lazy_check.checked = !lazy_check.checked;
            lazy_check.onchange();
            break;
        }
        case "c": {
            clearTerms();
            break;
        }
    }
});
