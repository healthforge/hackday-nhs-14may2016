fswatch -0 -o -e .git/ . | xargs -0 -I {} rsync -avz nginx.p.lfrg.uk:/opt/hackday/jamie/
