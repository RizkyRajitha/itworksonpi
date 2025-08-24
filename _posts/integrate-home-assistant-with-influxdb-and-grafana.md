---
title: "Integrate Home Assistant InfluxDB and Grafana for Stunning Dashboards"
date: "2025-08-25"
categories: "Home Automation,IOT"
featured: "true"
overview: "Learn to integrate Home Assistant with InfluxDB v2 and Grafana to create real-time smart home dashboards for monitoring sensor data like temperature and power usage."
---
# How to Integrate Home Assistant with InfluxDB and Grafana for Stunning Real-Time Dashboards

## **Hi everyone,**

In this post we will dive in to integrating [Home Assistant](https://www.home-assistant.io/) with [InfluxDB V2](https://docs.influxdata.com/influxdb/v2/), and [Grafana](https://grafana.com/grafana/) to store sensor data and create beautiful, real-time dashboards. 

This step-by-step guide is perfect for home automation enthusiasts and IoT developers looking to monitor and visualize sensor data efficiently.

## Prerequisites
Before we begin, ensure you have the following set up:

1. A working Home Assistant instance.
2. InfluxDB v2 installed and accessible (local or cloud-based).
3. Grafana installed and running (local or cloud-hosted).
4. Basic knowledge of YAML configuration for Home Assistant.
5. Access to your InfluxDB and Grafana admin interfaces.


## Architecture

To achieve real-time dashboards, we need a time-series database to store sensor data from Home Assistant, which Grafana can then use as a data source. InfluxDB is an open-source, high-performance time-series database, making it ideal for this use case. Home Assistant has a built-in integration for InfluxDB, allowing sensor data to be sent to a specified InfluxDB bucket. Grafana then connects to InfluxDB to create visually appealing dashboards for data visualization.

Below is a high-level architecture diagram:

![Data flows from Home Assistant sensors to InfluxDB, which Grafana queries to create real-time dashboards.](/assets/homeassistant_influxdb_grafana/architecture.png)

## Step 1 Setup home assistant with InfluxDB integration

The InfluxDB integration in Home Assistant is a legacy integration, meaning it must be configured manually via the configuration file (`configuration.yaml`) rather than the UI. 

Below, we’ll walk through the steps to set it up.

Refer [InfluxDB integration](https://www.home-assistant.io/integrations/influxdb/) for more details.

### Gather InfluxDB Details

You’ll need the following information from your InfluxDB v2 instance:

1. Hostname or IP address of your InfluxDB server.
2. Port (default is 8086 for InfluxDB v2).
3. API Token for authentication.
4. Organization ID.
5. Bucket Name for storing sensor data.

### Finding Your Organization ID

Log in to your InfluxDB v2 web interface. Click your profile in the top-left corner. Select the About tab to view your Organization ID.

![influxdb get organization id ui screenshot](/assets/homeassistant_influxdb_grafana/get-org-id.png)

### Creating Bucket

In the InfluxDB UI, navigate to the Load Data > Buckets section.

Click Create Bucket.

Provide a Bucket Name (e.g., home_assistant_data).

![influxdb create bucket ui screenshot](/assets/homeassistant_influxdb_grafana/create-bucket_1.png)

Optionally, set a Retention Period (e.g., 30 days) to manage data storage.

![influxdb create bucket ui screenshot](/assets/homeassistant_influxdb_grafana/create-bucket_2.png)

### Creating API Token

Go to the Load Data > Tokens section in the InfluxDB UI.

Click Generate API Token > Custom API Token.

![influxdb create token ui screenshot](/assets/homeassistant_influxdb_grafana/create_token_1.png)

Provide a descriptive name (e.g., Home_Assistant_Write).

Assign Write permissions to the bucket you just created. This adheres to the [least privilege principle](https://en.wikipedia.org/wiki/Principle_of_least_privilege) for enhanced security.

![influxdb create token ui screenshot](/assets/homeassistant_influxdb_grafana/create_token_2.png)

Now, update your Home Assistant `configuration.yaml` file with the InfluxDB integration settings.

Below is an example configuration that includes specific entities using entity_globs to filter data. 

For example, we’ll include Sonoff smart switches and Zigbee2MQTT temperature sensors. 

You can customize this to include other entities or entire domains as needed.

```yml
influxdb:
  api_version: 2
  ssl: false
  host: <INFLUXDB_IP>
  port: <POST default - 8086>
  token: <API_TOKEN>
  organization: <ORGANIZATION_ID>
  bucket: <BUCKET_NAME>
  tags:
    source: HA
  tags_attributes:
    - friendly_name
  default_measurement: units
  include:
    entity_globs:
      - sensor.sonoff*
      - sensor.l1_tah_sensor*
      - sensor.l2_tah_sensor*
```

Replace `<INFLUXDB_IP>`, `<API_TOKEN>`, `<ORGANIZATION_ID>`, and `<BUCKET_NAME>` with your InfluxDB details.

Make sure `api_version: 2` since we use InfluxDB V2.

The entity_globs section filters specific entities. Adjust this based on your sensors.

The `ssl: false` setting assumes a non-SSL connection. Set to `true` if your InfluxDB instance uses SSL.

After updating the configuration, restart Home Assistant to apply the changes.


### Verify Data in InfluxDB

Log in to the InfluxDB UI.

Navigate to the Data Explorer section.

Select your bucket and filter by the entities you configured (e.g., sensor.sonoff*).

You should see sensor data populating over time.

###### ~note~ If data isn’t appearing, verify your configuration, ensure the sensors are sending data, and confirm the API token has the correct permissions..

![influxdb bucket data explore ui screenshot](/assets/homeassistant_influxdb_grafana/view_data.png)

###### ~note~ if you change home assistant integration configurations, you must restart home assistant to take them into effect.

## Step 2 Setup InfluxDB integration with Grafana

With data flowing into InfluxDB, it’s time to connect it to Grafana as a data source.

Log in to your Grafana instance.

Navigate to Configuration > Data Sources > Add Data Source.

![grafana add new data source ui screenshot](/assets/homeassistant_influxdb_grafana/add_influxdb_to_grafana.png)

Select InfluxDB from the list. 

![grafana add new data source ui screenshot](/assets/homeassistant_influxdb_grafana/add_influxdb_to_grafana_2.png)

Configure the data source with the following details:

 - Name: A descriptive name (e.g., Home_Assistant_InfluxDB).
 - Query Language: Select *Flux* (since we use InfluxDB v2).
 - URL: Enter your InfluxDB URL (e.g., http://INFLUXDB_IP:8086).
 - Organization: Your InfluxDB *Organization name*.
 - Token: Generate a new API token in InfluxDB with Read permissions for your bucket (follow same steps we did earlier. make sure to only provide read permissions).

Click Save & Test. You should see a success message confirming the connection.

![grafana add new data source ui screenshot](/assets/homeassistant_influxdb_grafana/add_influxdb_to_grafana_3.png)

###### ~note~ Security Tip: Use separate API tokens for Home Assistant (write) and Grafana (read) adhering to least privileges to maintain secure access control.

## Step 3 Create Stunning Grafana Dashboards

Now comes the exciting part, building your real-time dashboards in Grafana!

In Grafana, go to Dashboards > Create Dashboard 

![grafana add new dashboard ui screenshot](/assets/homeassistant_influxdb_grafana/create_dashabord_1.png)

Add Visualization.

![grafana add new dashboard ui screenshot](/assets/homeassistant_influxdb_grafana/create_dashabord_2.png)

Select your newly created InfluxDB data source.

![grafana add new dashboard ui screenshot](/assets/homeassistant_influxdb_grafana/create_dashboard_3.png)

Write a Flux query to fetch your sensor data. If you’re unsure how to write Flux queries, use the InfluxDB Data Explorer to build and test queries visually.

In InfluxDB’s Data Explorer, select your bucket and desired entities.

Filter and aggregate data as needed (e.g., mean temperature over time).

![influxdb bucket data explore ui screenshot](/assets/homeassistant_influxdb_grafana/influxdb_explorer.png)

Click *script editor* to switch to the Script Editor to view the generated Flux query.

![influxdb bucket data explore ui screenshot](/assets/homeassistant_influxdb_grafana/influxdb_explorer_2.png)

Copy the Flux query from InfluxDB and paste it into Grafana’s query editor.

Click Refresh to visualize the data.

![grafana add new data source ui screenshot](/assets/homeassistant_influxdb_grafana/create_dashboard_4.png)

Customize your dashboard:
 - Adjust the visualization type (e.g., line graph, gauge, or heatmap).
 - Add multiple panels for different sensors (e.g., temperature, humidity, or power usage).
 - Use Grafana’s styling options to enhance the look and feel.

###### ~note~ Pro Tip: Experiment with Grafana’s Thresholds and Alerts to highlight critical values or receive notifications when sensors report unusual data.

### Final Thoughts

Congratulations! 🥳 You’ve successfully integrated Home Assistant with InfluxDB and Grafana to create stunning, real-time dashboards. 
From here, your imagination is the only limit build dashboards to monitor energy usage, track indoor climate, or visualize smart home trends over time.

### Additional Tips

Optimize Data Retention: Set appropriate retention policies in InfluxDB to manage storage efficiently.

Secure Your Setup: Use SSL for InfluxDB and Grafana in production environments.

Explore Grafana Plugins: Enhance your dashboards with plugins like the Worldmap Panel for geolocation data.

Backup Configurations: Regularly back up your Home Assistant and Grafana configurations to avoid data loss.

For further details, check the official documentation:

 - [Home Assistant InfluxDB Integration](https://www.home-assistant.io/integrations/influxdb/)
 - [InfluxDB Documentation](https://docs.influxdata.com/influxdb/v2/get-started/)
 - [Grafana Documentation](https://grafana.com/docs/grafana/latest/getting-started/build-first-dashboard/)

### Thank you for reading, and happy dashboarding!