const fs = require('fs');
let html = fs.readFileSync('cxg-basics.html', 'utf8');

const regex = /<div\s+class="two-column"[\s\S]*?<!-- Slide: Pragmatic Intent \& Speech Act Profile/m;

const replacement = `<div style="display: flex; flex-direction: column; gap: 18px">
            <div
              style="
                background: #ffffff;
                padding: 28px;
                border-radius: 10px;
                box-shadow: 0 10px 30px rgba(0, 0, 0, 0.03);
                flex-grow: 1;
                border-top: 3px solid #6b7faa;
              "
            >
              <div
                style="
                  font-family: &quot;Inter&quot;, sans-serif;
                  font-size: 12px;
                  font-weight: 600;
                  letter-spacing: 2px;
                  text-transform: uppercase;
                  color: #6b7faa;
                  margin-bottom: 10px;
                "
              >
                Relational Querying &amp; Knowledge Retrieval
              </div>
              <h3 style="font-size: 26px; margin-bottom: 14px">
                Semantic Equation Indexing &amp; Automated Entailment
              </h3>

              <div style="font-size: 16px; line-height: 1.55; color: #4a4a4a">
                Transforms syntax into a computable mathematical equation. Allows graph databases to map logical consequences (Entailments) natively. If the database logs "A is given to B," the relational logic automatically infers the new data state "B possesses A," allowing the database to generate structural truths without relying on external NLP inference.
              </div>
            </div>
          </div>
        </div>
    </div>

    <!-- Slide: Pragmatic Intent & Speech Act Profile`;

if(regex.test(html)){
  const newHtml = html.replace(regex, replacement);
  fs.writeFileSync('cxg-basics.html', newHtml);
  console.log("REPLACED");
} else {
  console.log("NOT FOUND");
}
