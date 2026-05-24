# The ODI Build Room

Snowflake Summit demo. Four dbt-wizard sub-agents build a new dbt model live on the open lake in ninety seconds. Sister to the ODI Crisis Room and the ODI Brief Room.

Canonical flow: Source → Fivetran → Iceberg (MDLS) → Snowflake / Athena / Trino → dbt Labs → React. Fivetran lands every CDC row into Iceberg on S3 in open Apache Iceberg format — one copy of the bytes. Snowflake, Athena, and Trino read the same Iceberg files via external catalogs. Fivetran Transformations triggers dbt Labs the moment the source sync finishes; bronze → silver → gold stays in Iceberg. Frontend is React 19 + Vite + Tailwind v4 deployed as a static SPA to GitHub Pages.

Cardinal Provisions is a fictional CPG used across the Fivetran ODI demo catalog. All data is synthetic. The architecture is real.

Live: https://fivetran-jasonchletsos.github.io/Build-Room-ODI-Demo/
