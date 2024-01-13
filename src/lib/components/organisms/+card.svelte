<script lang="ts">
  export let name;
  export let gender;
  export let patientId;
  export let dob;
</script>

<div class="card cursor-pointer position-relative">
  <span class="card__name">{ name }</span>
  <div class="card__text">DOB: { dob ?? "" }</div>
  <div class="card__text">patientId: { patientId ?? "" }</div>
  <p class="card__description"><slot></slot></p>
</div>

<style>
  .card {
    padding: 10px;
    border: .2px solid #CCC;
    box-shadow: .5px .5px 1px rgba(139, 101, 77, 0.2),
                .5px .5px 1px rgba(139, 101, 77, 0.2);
    text-align: left;
    background: #FEFEFE;
    border-radius: 5px;
    margin-bottom: 10px;
    width: 300px;
    max-width: 80%;
    min-height: 100px
  }

  .card__text {
    font-color: #555;
    font-size: .8em;
  }

  .card__description {
    font-color: #888;
    font-size: .7em;
  }

  .card__name {
    font-size: 1.5em;
  }
</style>
