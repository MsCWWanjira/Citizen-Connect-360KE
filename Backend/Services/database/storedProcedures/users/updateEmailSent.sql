USE CitizenConnect360KE;

CREATE PROCEDURE updateUserEmailSent(
    @id VARCHAR(255)
)

AS
BEGIN
    UPDATE users
    SET isEmailSent = 1
    WHERE id = @id;
END

GO;