/* eslint-disable no-undef */
const MAX_REDUCTION_DEPTH = 128;

let lambda_terms = document.getElementById("lambda_terms");
let lambda_inp = document.getElementById("lambda_inp");
let popup = document.getElementById("popup");

let lazy_check = document.getElementById("lazy");
let intermediate_check = document.getElementById("intermediate");

let lazy = lazy_check.checked;
let intermediate = intermediate_check.checked;

let currTerm = undefined;
const parseInp = () => {
    let inp = lambda_inp.value;
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

    newTerm.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
    });
};
const clearTerms = () => {
    while (lambda_terms.lastChild) {
        lambda_terms.removeChild(lambda_terms.lastChild);
    }
    reInputTerm();
};
const reduce = () => {
    let term = getTerm();
    addTerm(c_term_display(term));
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

lambda_inp.oninput = () => {
    clearTerms();
    reduce();
};

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
            console.log("cleared");
            clearTerms();
            break;
        }
    }
});
