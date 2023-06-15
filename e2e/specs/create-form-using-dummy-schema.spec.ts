import { test } from "../core";
import { expect } from "@playwright/test";
import { deleteForm } from "../commands/form-operations";
import { FormBuilderPage } from "../pages";

let formUuid = null;

test("Create a form using the `Input Dummy Schema` feature", async ({
  page,
}) => {
  const formBuilderPage = new FormBuilderPage(page);

  await test.step("When I visit the form builder", async () => {
    await formBuilderPage.gotoFormBuilder();
  });

  await test.step("And click the `Create New Form` button", async () => {
    await formBuilderPage.createNewFormButton().click();
  });

  await test.step("Then I click the `Input Dummy Schema` button", async () => {
    await formBuilderPage.inputDummySchemaButton().click();
  });

  await test.step("Then I click the `Save Form` button", async () => {
    await formBuilderPage.saveForm();
  });

  await test.step("Then should get a success message and be redirected to the edit page for the new form", async () => {
    // Checks whether the user has been redirected to the edit page
    const editFormPageURLRegex = new RegExp("/edit/");
    await expect(page.getByText("Form created")).toBeVisible();
    await page.waitForURL(editFormPageURLRegex);
    const editFormPageURL = await page.url();
    formUuid = editFormPageURL.split("/").slice(-1)[0];
  });
});

test.afterEach(async ({ api }) => {
  if (formUuid) {
    await deleteForm(api, formUuid);
  }
});
