(function () {
    "use strict";

    const vmTableOfContent = () => {
        const tocContainer = document.getElementById('vm-table-of-content');
        if (!tocContainer) return;

        // Query inside the post content to avoid sidebars
        const contentContainer = document.querySelector('.main-section-left__content');
        if (!contentContainer) {
            tocContainer.style.display = 'none';
            return;
        }

        const headings = contentContainer.querySelectorAll('h2, h3');
        if (headings.length === 0) {
            tocContainer.style.display = 'none';
            return;
        }

        // Build HTML
        let tocHTML = '<div class="toc-header">Table of Contents</div><ul class="toc-list">';
        let insideH3List = false;

        headings.forEach((heading, index) => {
            // Generate ID if missing
            if (!heading.id) {
                const text = heading.innerText || heading.textContent;
                heading.id = text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '') + '-' + index;
            }

            const tagName = heading.tagName.toLowerCase();
            const headingId = heading.id;
            const headingText = heading.innerText || heading.textContent;

            if (tagName === 'h2') {
                if (insideH3List) {
                    tocHTML += '</ul></li>';
                    insideH3List = false;
                } else if (index > 0) {
                    tocHTML += '</li>'; // close previous h2 if no h3s were in it
                }
                tocHTML += `<li class="toc-item toc-h2"><a href="#${headingId}">${headingText}</a>`;
            } else if (tagName === 'h3') {
                if (!insideH3List) {
                    tocHTML += '<ul class="toc-nested-list">';
                    insideH3List = true;
                }
                tocHTML += `<li class="toc-item toc-h3"><a href="#${headingId}">${headingText}</a></li>`;
            }
        });

        // Close trailing tags
        if (insideH3List) {
            tocHTML += '</ul></li>';
        } else if (headings.length > 0) {
            // Only close an h2 if the very last element wasn't inside an h3 list
            const lastTag = headings[headings.length - 1].tagName.toLowerCase();
            if (lastTag === 'h2') {
                tocHTML += '</li>';
            }
        }
        tocHTML += '</ul>';

        tocContainer.innerHTML = tocHTML;
        tocContainer.style.display = 'block';

        // Smooth scroll
        const tocLinks = tocContainer.querySelectorAll('a');
        tocLinks.forEach(link => {
            link.addEventListener('click', function (e) {
                e.preventDefault();
                const targetId = this.getAttribute('href').substring(1);
                const targetEl = document.getElementById(targetId);
                if (targetEl) {
                    // Accounting for fixed header
                    const offset = 100;
                    const bodyRect = document.body.getBoundingClientRect().top;
                    const elementRect = targetEl.getBoundingClientRect().top;
                    const elementPosition = elementRect - bodyRect;
                    const offsetPosition = elementPosition - offset;

                    window.scrollTo({
                        top: offsetPosition,
                        behavior: 'smooth'
                    });
                }
            });
        });

        // Intersection Observer for highlighting
        const observerOptions = {
            root: null,
            rootMargin: '-100px 0px -70% 0px',
            threshold: 0
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const id = entry.target.id;
                    const activeLink = tocContainer.querySelector(`a[href="#${id}"]`);
                    
                    if (activeLink) {
                        // Remove active class from all
                        tocLinks.forEach(link => link.classList.remove('is-active'));
                        // Add active class
                        activeLink.classList.add('is-active');
                    }
                }
            });
        }, observerOptions);

        headings.forEach(heading => observer.observe(heading));
    };

    document.addEventListener("DOMContentLoaded", vmTableOfContent);
})();
