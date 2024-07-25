USE CitizenConnect360KE;

CREATE OR ALTER PROCEDURE updateActivatedPasswordReset(
    @id VARCHAR(255)
)

AS
BEGIN
    UPDATE users
    SET passwordReset = 0
    WHERE id = @id;
END;

GO;