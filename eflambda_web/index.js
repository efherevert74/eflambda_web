/* eslint-disable no-undef */
const MAX_REDUCTION_DEPTH = 2 << 14;

let lambda_terms = document.getElementById("lambda-terms");
let lambda_inp = document.getElementById("lambda-inp");
let var_lib_panel = document.getElementById("var-lib-panel");
let popup = document.getElementById("popup");

let lazy_check = document.getElementById("lazy");
let intermediate_check = document.getElementById("intermediate");

let lazy = lazy_check.checked;
let intermediate = intermediate_check.checked;

let currTerm = undefined;

// parse
const parseInpPreview = () => {
    let inp = lambda_inp.value.replaceAll("λ", "\\");
    let term = c_term_parse_preview(inp);
    return term;
};

// parse + update vars
const parseInpCommit = () => {
    let inp = lambda_inp.value.replaceAll("λ", "\\");
    let term = c_term_parse_commit(inp);
    return term;
};

// parse into currTerm
const reParseInpPreview = () => {
    if (currTerm !== undefined) {
        c_term_free(currTerm);
    }
    currTerm = parseInpPreview();
};

// parse into currTerm + commit
const reParseInpCommit = () => {
    if (currTerm !== undefined) {
        c_term_free(currTerm);
    }
    currTerm = parseInpCommit();
};

const getTerm = () => {
    if (currTerm === undefined) {
        currTerm = parseInpCommit();
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
    // wait a little for browser to react to deletion before scrolling
    setTimeout(
        () => window.scrollTo({ top: 0, left: 0, behavior: "smooth" }),
        30,
    );
};

// parse + show
const previewReduction = () => {
    let term = parseInpPreview();
    addTerm(c_term_display(term));
    c_term_free(term); // free the temp term
};

// reduce + commit + update UI
const reduce = () => {
    let term = getTerm();

    let termNode = addTerm(c_term_display(term));
    termNode.scrollIntoView({ behavior: "smooth", block: "nearest" });

    c_term_reduce(term, lazy);
    updateVarLibPanel();
};

const showPopup = (message) => {
    popup.innerText = message;
    popup.classList.remove("hidden");
    setTimeout(() => {
        popup.classList.add("hidden");
    }, 3000);
};

// reduce until normal + commit + update UI
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
    updateVarLibPanel();
    lambda_terms.lastChild.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
    });
};

const updateVarLibPanel = () => {
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

lazy_check.onchange = () => {
    lazy = lazy_check.checked;
};

intermediate_check.onchange = () => {
    intermediate = intermediate_check.checked;
};

lambda_inp.oninput = () => {
    clearTerms();
    reParseInpPreview();
    previewReduction();
};

Promise.all([
    new Promise((resolve) => {
        document.addEventListener("DOMContentLoaded", resolve, { once: true });
    }),
    new Promise((resolve) => {
        document.addEventListener("WASMReady", resolve, { once: true });
    }),
]).then(() => {
    c_var_lib_fill_std();
    if (lambda_inp.value === "") {
        lambda_inp.value = "+ 1 2"; // add showcase term
    }
    reParseInpCommit(); // parse and commit showcase term
    updateVarLibPanel();
    // trigger a preview
    lambda_inp.oninput();
});

// keybindings
document.addEventListener("keydown", (event) => {
    // TODO: check this
    // fixes escape not acting on input field
    if (event.code === "Escape") {
        if (document.activeElement === lambda_inp) {
            lambda_inp.blur();
        }
    }
    if (event.code === "Enter") {
        event.preventDefault();
        if (event.shiftKey) {
            reduceFull();
        } else {
            reduce();
        }
        return;
    }

    // don't act if the focus is on the input field
    // or something else
    if (document.activeElement !== document.body) {
        return;
    }

    switch (event.key) {
        case "I": {
            intermediate_check.checked = !intermediate_check.checked;
            intermediate_check.onchange();
            break;
        }
        case "L": {
            lazy_check.checked = !lazy_check.checked;
            lazy_check.onchange();
            break;
        }
        case "C": {
            clearTerms();
            reParseInpCommit();
            if (currTerm !== undefined) {
                c_term_free(currTerm);
                currTerm = undefined;
            }
            previewReduction();
            break;
        }
        case "X": {
            c_var_lib_clear();
            updateVarLibPanel();
            break;
        }
        case "S": {
            c_var_lib_fill_std();
            updateVarLibPanel();
        }
    }
});
