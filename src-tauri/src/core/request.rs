use reqwest::Error;

#[tokio::main]
pub async fn request() -> Result<(), Error> {
    let response = reqwest::get("https://sonorus-inference-service-app.ashydesert-a68a372d.australiaeast.azurecontainerapps.io/").await?;
    let body = response.text().await?;
    println!("body = {:?}", body);
    Ok(())
}
